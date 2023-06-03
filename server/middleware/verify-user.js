const { verifyAccessToken, encode  } = require("../services/jwt.service");
const { ninetyDays } = require('../config')
const RefreshToken = require('../models/user-token');

async function verifyUser(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new Error('Not authorized');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new Error('Not authorized');
        }
        let decoded;
        try {
            decoded = verifyAccessToken(token);
        } catch (error) {
            throw new Error('invalid token');
        }

        const { userId, iat: creationTime } = decoded;
        const currentTime = Math.floor(Date.now() / 1000);

        if (currentTime - creationTime > 10 * 60) {
            const isTokenInDB = await RefreshToken.exists({ user: userId, token: decoded.identifier });

            if (isTokenInDB) {
                const { identifier, refresh_token } = encode({ userId: decoded.userId, email: decoded.email });

                await RefreshToken.updateOne(
                    { user: userId, token: decoded.identifier },
                    { $set: { token: identifier } }
                );
                res.cookie('token', refresh_token, { httpOnly: true, maxAge: ninetyDays, path: '/api' });
            } else {
                throw new Error('Token not in DB');
            }
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.log(error.message);
        res.cookie('token', '', { httpOnly: true, maxAge: 0, path: '/api' });
        res.status(401).json({ message: error.message });
    }
}

module.exports = verifyUser;
