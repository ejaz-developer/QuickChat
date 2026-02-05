import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {createHttpError} from "../utils/httpError.js";

export const authGuard = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        throw createHttpError(401, "Authentication token missing");
    }

    if (!process.env.JWT_SECRET) {
        throw createHttpError(500, "JWT_SECRET missing on server");
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw createHttpError(401, "Invalid or expired token");
    }

    const userId = decoded.sub || decoded.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw createHttpError(401, "User for token no longer exists");
    }

    req.user = user;
    next();
});
