import Router from "express";
import {
    getMessages,
    getUsersForSidebar,
    sendMessage
} from "../controllers/message.controller.js";
import { authGuard } from "../middlewares/auth.middleware.js";

export const messageRouter = Router();

messageRouter.get("/users", authGuard, getUsersForSidebar);
messageRouter.get("/:id", authGuard, getMessages);
messageRouter.post("/:id", authGuard, sendMessage);
