import Router from "express";
import {createUser, deleteUser, getUserById, listUsers, updateUser} from "../controllers/user.controller.js";
import { login, logout, me } from "../controllers/auth.controller.js";
import { authGuard } from "../middlewares/auth.middleware.js";

export const userRouter = Router();

userRouter.post("/register", createUser);
userRouter.post("/login", login);
userRouter.get("/me", authGuard, me);
userRouter.get("/", authGuard, listUsers);
userRouter.get("/:id", authGuard, getUserById);
userRouter.post("/logout", authGuard, logout);
userRouter.put("/:id", authGuard, updateUser);
userRouter.delete("/:id", authGuard, deleteUser);
