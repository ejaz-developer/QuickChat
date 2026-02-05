import jwt from "jsonwebtoken";

export const generateToken = (payload, options = {}) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
        ...options
    });
};

export const verifyToken = (token) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }

    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return null;
    }
}

export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}