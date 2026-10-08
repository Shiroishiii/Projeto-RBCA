import rateLimit from "express-rate-limit";

const loginRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,

    limit: 5,

    standardHeaders: true,
    legacyHeaders: false,

    message: {
        message: "Muitas tentativas de login.",
        retryAfter: 15 * 60,
    },

    handler: (req, res) => {
        const retryAfter = 15 * 60;

        return res.status(429).json({
            message: "Muitas tentativas de login.",
            retryAfter,
        });
    },
});

export default loginRateLimit;