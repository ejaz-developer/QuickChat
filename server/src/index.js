import express from "express";
import http from "http";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.route.js";
import { messageRouter } from "./routes/message.route.js";
import { connectDB } from "./utils/connectDB.js";
import { initWebSocketServer } from "./utils/socket.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import cors from "cors";
configDotenv({
    path: './.env'
});
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(cors({
    origin: [process.env.CLIENT_ORIGIN, 'http://192.168.0.103:5173/'],
    credentials: true,
}))
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);
app.use(notFoundHandler);
app.use(errorHandler);

const server = http.createServer(app);
initWebSocketServer(server);

server.listen(port, () => {
    connectDB().then((db) => {
        console.log(`Connected to database: ${db.port}`);
    });
    console.log(`Server started on port ${port}`);
});
