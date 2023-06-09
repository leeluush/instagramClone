const { verifyAccessToken, encode } = require("../services/jwt.service");
const RefreshToken = require('../models/refreshToken');
const cookie = require('cookie');
const ninetyDays = 90 * 24 * 60 * 60 * 1000;

const authMiddleware = async (req, res, next) => {
    try {
        // Parse cookies from the request
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies.accessToken;

        // If no token, throw an error
        if (!token) {
            throw new Error('Not authorized');
        }

        // Verify the access token
        let decoded;
        try {
            decoded = verifyAccessToken(token);
        } catch (error) {
            throw new Error('Invalid token');
        }

        // Extract the userId and the token creation time
        const { userId, iat: creationTime } = decoded;
        const currentTime = Math.floor(Date.now() / 1000);

        // If the token is expired but within the 10-minute window, refresh it
        if (currentTime - creationTime > 10 * 60) {
            const isTokenInDB = await RefreshToken.exists({ user: userId, token: decoded.identifier });

            // If refresh token exists in the database
            if (isTokenInDB) {
                // Create a new token and refresh token
                const { identifier, refresh_token } = encode({ userId: decoded.userId, email: decoded.email });

                // Replace the old token in the database with the new one
                await RefreshToken.updateOne(
                    { user: userId, token: decoded.identifier },
                    { $set: { token: identifier } }
                );

                // Send the new token to the client in a cookie
                res.cookie('accessToken', refresh_token, { httpOnly: true, maxAge: ninetyDays, path: '/api' });

                // Decode the new token for further processing
                decoded = verifyAccessToken(refresh_token);
            } else {
                throw new Error('Token not in DB');

                // TODO check the times and in check errors i might need to add res.200
            }
        }

        // Attach user data to the request
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error.message);

        // If any error occurs, clear the token cookie and respond with an error
        res.cookie('accessToken', '', { httpOnly: true, maxAge: 0, path: '/api' });
        res.status(401).json({ message: error.message });
    }
}

module.exports = authMiddleware;
