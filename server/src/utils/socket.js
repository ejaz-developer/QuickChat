import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { buildConversationId } from "./conversation.js";

let wss;

const userSockets = new Map();
const roomSockets = new Map();
const onlineUsers = new Set();

const parseCookies = (cookieHeader = "") => {
    const cookies = {};
    cookieHeader.split(";").forEach((chunk) => {
        const [rawKey, ...rest] = chunk.trim().split("=");
        if (!rawKey) {
            return;
        }
        cookies[rawKey] = decodeURIComponent(rest.join("="));
    });
    return cookies;
};

const addToMapSet = (map, key, value) => {
    if (!map.has(key)) {
        map.set(key, new Set());
    }
    map.get(key).add(value);
};

const removeFromMapSet = (map, key, value) => {
    const set = map.get(key);
    if (!set) {
        return;
    }
    set.delete(value);
    if (set.size === 0) {
        map.delete(key);
    }
};

const safeSend = (ws, data) => {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
    }
};

const getTokenFromRequest = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
        return authHeader.slice(7);
    }

    const cookies = parseCookies(req.headers.cookie || "");
    if (cookies.token) {
        return cookies.token;
    }

    try {
        const url = new URL(req.url, "http://localhost");
        return url.searchParams.get("token");
    } catch {
        return null;
    }
};

const closeWithUnauthorized = (ws) => {
    ws.close(1008, "Unauthorized");
};

const removeSocketFromRooms = (ws) => {
    if (!ws.rooms) {
        return;
    }
    for (const roomId of ws.rooms) {
        removeFromMapSet(roomSockets, roomId, ws);
    }
    ws.rooms.clear();
};

const broadcast = (event, payload) => {
    const message = JSON.stringify({ event, payload });
    for (const sockets of userSockets.values()) {
        for (const ws of sockets) {
            safeSend(ws, message);
        }
    }
};

const addOnlineUser = (userId) => {
    if (!onlineUsers.has(userId)) {
        onlineUsers.add(userId);
        broadcast("presence", { userId, status: "online" });
    }
};

const removeOnlineUser = (userId) => {
    if (onlineUsers.has(userId)) {
        onlineUsers.delete(userId);
        broadcast("presence", { userId, status: "offline" });
    }
};

export const initWebSocketServer = (server) => {
    if (wss) {
        return wss;
    }

    wss = new WebSocketServer({ server, path: "/ws" });

    wss.on("connection", (ws, req) => {
        ws.rooms = new Set();

        (async () => {
            const token = getTokenFromRequest(req);
            if (!token || !process.env.JWT_SECRET) {
                closeWithUnauthorized(ws);
                return;
            }

            let decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch {
                closeWithUnauthorized(ws);
                return;
            }

            const userId = decoded.sub || decoded.id;
            if (!userId) {
                closeWithUnauthorized(ws);
                return;
            }

            const user = await User.findById(userId).select("_id");
            if (!user) {
                closeWithUnauthorized(ws);
                return;
            }

            ws.userId = user._id.toString();
            addToMapSet(userSockets, ws.userId, ws);
            safeSend(ws, JSON.stringify({ event: "connected", payload: { userId: ws.userId } }));
            safeSend(ws, JSON.stringify({ event: "presence:list", payload: Array.from(onlineUsers) }));
            addOnlineUser(ws.userId);
        })().catch(() => {
            ws.close(1011, "Server error");
        });

        ws.on("message", (data) => {
            let payload;
            try {
                payload = JSON.parse(data.toString());
            } catch {
                return;
            }

            if (!payload || !ws.userId) {
                return;
            }

            if (payload.type === "join") {
                const peerId = payload.peerId || payload.userId;
                if (!peerId) {
                    return;
                }
                const roomId = buildConversationId(ws.userId, peerId);
                addToMapSet(roomSockets, roomId, ws);
                ws.rooms.add(roomId);
                safeSend(ws, JSON.stringify({ event: "joined", payload: { roomId } }));
                return;
            }

            if (payload.type === "leave") {
                const roomId =
                    payload.roomId ||
                    (payload.peerId ? buildConversationId(ws.userId, payload.peerId) : null);
                if (!roomId) {
                    return;
                }
                removeFromMapSet(roomSockets, roomId, ws);
                ws.rooms.delete(roomId);
                safeSend(ws, JSON.stringify({ event: "left", payload: { roomId } }));
                return;
            }

            if (payload.type === "typing" || payload.type === "stopTyping") {
                const peerId = payload.peerId;
                if (!peerId) {
                    return;
                }
                const roomId = buildConversationId(ws.userId, peerId);
                emitToRoom(roomId, "typing", {
                    userId: ws.userId,
                    peerId,
                    isTyping: payload.type === "typing",
                });
            }
        });

        ws.on("close", () => {
            if (ws.userId) {
                removeFromMapSet(userSockets, ws.userId, ws);
                const remaining = userSockets.get(ws.userId);
                if (!remaining || remaining.size === 0) {
                    removeOnlineUser(ws.userId);
                }
            }
            removeSocketFromRooms(ws);
        });
    });

    return wss;
};

export const emitToRoom = (roomId, event, payload) => {
    const sockets = roomSockets.get(roomId);
    if (!sockets || sockets.size === 0) {
        return;
    }
    const message = JSON.stringify({ event, payload });
    for (const ws of sockets) {
        safeSend(ws, message);
    }
};
