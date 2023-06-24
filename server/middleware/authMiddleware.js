const { verifyAccessToken, verifyRefreshToken, encode } = require("../services/jwt.service");
const RefreshToken = require('../modules/auth/refreshToken.model');
const cookie = require('cookie');
const fifteenMinutes = 15 * 60 * 1000;

const authMiddleware = async (req, res, next) => {
    try {
        // Parse cookies from the request
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies.accessToken;
        const refreshToken = cookies.refreshToken;

        // If no token, throw an error
        if (!token) {
            throw new Error('Not authorized');
        }

        // Verify the access token
        let decoded;
        try {
            decoded = verifyAccessToken(token);
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                // If the token is expired, verify the refresh token and generate a new access token
                const decodedRefreshToken = verifyRefreshToken(refreshToken);
                const { identifier } = decodedRefreshToken;
                const isTokenInDB = await RefreshToken.exists({ user: identifier, token: refreshToken });

                if (!isTokenInDB) {
                    throw new Error('Invalid refresh token');
                }

                const newTokens = encode({ userId: identifier });
                decoded = verifyAccessToken(newTokens.access_token);

                // Replace the old token in the database with the new one
                await RefreshToken.updateOne(
                    { user: identifier, token: refreshToken },
                    { $set: { token: newTokens.refresh_token } }
                );

                // Send the new tokens to the client in cookies
                res.cookie('accessToken', newTokens.access_token, { httpOnly: true, maxAge: fifteenMinutes, path: '/api' });
                res.cookie('refreshToken', newTokens.refresh_token, { httpOnly: true, maxAge: ninetyDays, path: '/api' });
            } else {
                throw new Error('Invalid token');
            }
        }

        // Attach user data to the request
        req.user = { id: decoded.userId };
        
        next();
    } catch (error) {
        console.log(error.message);

        // If any error occurs, clear the token cookies and respond with an error
        res.cookie('accessToken', '', { httpOnly: true, maxAge: 0, path: '/api' });
        res.cookie('refreshToken', '', { httpOnly: true, maxAge: 0, path: '/api' });
        res.status(401).json({ message: error.message });
    }
}

module.exports = authMiddleware;
