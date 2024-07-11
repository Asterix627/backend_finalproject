const prisma = require("../../prisma/client");
const jwt = require("jsonwebtoken");

const refreshToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res
            .status(401)
            .json({ message: "Tidak ada refresh token yang diberikan" });
    }
    try {
        const user = await prisma.user.findFirst({
            where: {
                token: refreshToken,
            },
        });
        if (!user) {
            return res
                .status(403)
                .json({ message: "Refresh token tidak valid" });
        }
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err) {
                    return res
                        .status(403)
                        .json({ message: "Verifikasi token gagal" });
                }
                const token = jwt.sign(
                    { id: user.id },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "120s",
                    },
                );
                res.status(200).json({ token, user });
            },
        );
    } catch (error) {
        return res.status(500).json({
            message: "Kesalahan server internal",
            error: error.message,
        });
    }
};

module.exports = { refreshToken };
