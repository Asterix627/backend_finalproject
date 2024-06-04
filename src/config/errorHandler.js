const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";
    const responseBody = { msg: message };

    if (process.env.NODE_ENV === "development") {
        responseBody.stack = err.stack;
    }

    res.status(statusCode).json(responseBody);
};

module.exports = errorHandler;