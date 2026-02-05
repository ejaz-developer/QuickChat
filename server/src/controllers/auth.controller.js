import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {cookieOptions, generateToken} from "../utils/jwt.js";
import {createHttpError} from "../utils/httpError.js";

const sanitizeUser = (userDoc) => {
    const user = userDoc.toObject({versionKey: false});
    delete user.password;
    return user;
};

export const login = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!password || (!email && !username)) {
        throw createHttpError(400, "Provide username or email plus password");
    }

    const user = await User.findOne({
        $or: [{ email: email || null }, { username: username || null }]
    });
    if (!user) {
        throw createHttpError(401, "Invalid credentials");
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
        throw createHttpError(401, "Invalid credentials");
    }

    const token = generateToken({ sub: user._id.toString(), username: user.username });
    res.cookie("token", token, cookieOptions);
    res.json({ status: 200, user: sanitizeUser(user), token });
});

export const me = asyncHandler(async (req, res) => {
    res.json({user: req.user});
});

export const logout = asyncHandler(async (req, res) => {
        res.clearCookie("token", cookieOptions);
        res.json({status: 200, message: "Logged out successfully"});
    }
);
