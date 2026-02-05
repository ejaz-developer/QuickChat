import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createHttpError } from "../utils/httpError.js";
import { cookieOptions, generateToken } from "../utils/jwt.js";

const sanitizeUser = (doc) => {
    const user = doc.toObject({versionKey: false});
    delete user.password;
    return user;
};

const SALT_ROUNDS = 10;

export const createUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        throw createHttpError(400, "username, email, and password are required");
    }
    const existing = await User.findOne({
        $or: [{ username: username }, { email: email }]
    });

    if (existing) {
        throw createHttpError(409, "User with provided username or email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });

    const token = generateToken({ sub: user._id.toString(), username: user.username });
    res.cookie("token", token, cookieOptions);
    res.status(201).json({ user: sanitizeUser(user), token });
});

export const listUsers = asyncHandler(async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 25, 100);
    const page = Math.max(Number(req.query.page) || 1, 1);

    const [users, total] = await Promise.all([
        User.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .select("-password"),
        User.countDocuments()
    ]);

    res.json({
        data: users,
        meta: {page, limit, total}
    });
});

export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
        throw createHttpError(404, "User not found");
    }
    res.json(user);
});

export const updateUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const updates = {...req.body};

    if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, SALT_ROUNDS);
    }

    const user = await User.findByIdAndUpdate(id, updates, {new: true, runValidators: true}).select("-password");
    if (!user) {
        throw createHttpError(404, "User not found");
    }

    res.json(user);
});

export const deleteUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
        throw createHttpError(404, "User not found");
    }

    res.status(204).send();
});
