export const notFoundHandler = (req, res, next) => {
    res.status(404).json({message: `Route ${req.originalUrl} not found`});
};

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const payload = {
        message: err.message || "Unexpected server error"
    };

    if (process.env.NODE_ENV === "development" && err.stack) {
        payload.stack = err.stack;
    }

    res.status(statusCode).json(payload);
};
