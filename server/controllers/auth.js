const User = require("../models/user");
const RefreshToken = require('../models/refreshToken');
const { encode, verifyRefreshToken } = require("../services/jwt.service");
const bcrypt = require("bcrypt");

// Log in a user and return access and refresh tokens
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by their email
        const user = await User.findOne({ email }).exec();

        // If user doesn't exist, return a 401 Unauthorized error
        if (!user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Check if the submitted password matches the user's password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        
        // If the password doesn't match, return a 401 Unauthorized error
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Generate new access and refresh tokens for the user
        const { access_token, refresh_token } = encode({ email, userId: user._id });

        // Save the refresh token in the database
        const userRefreshToken = new RefreshToken({ token: refresh_token, user: user._id });
        await userRefreshToken.save();

        // Send the tokens to the client in cookies
        res.cookie('accessToken', access_token, { httpOnly: true, maxAge: 15 * 60 * 1000, path: '/api' }) // 15 minutes
        res.cookie('refreshToken', refresh_token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, path: '/api' }) //7 days

        // Return the user info and tokens to the client
        return res.status(200).json({
            message: 'Logged in successfully.',
            payload: {
                user: {
                    _id: user._id,
                    userName: user.userName,
                    email: user.email,
                    profileImage: user.profileImage
                }
            },
            tokens: { access_token, refresh_token }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to log in' });
    }
}

// Refresh a user's tokens
const refreshToken = async (req, res) => {
    // Get the existing refresh token from the request cookies
    const existingRefreshToken = req.cookies ? req.cookies['refreshToken'] : '';   

    try {
        // Verify the refresh token
        const decoded = verifyRefreshToken(existingRefreshToken);

        // If the token can't be verified, return a 401 Unauthorized error
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const { userId, email } = decoded;

        // Find the refresh token in the database
        const refreshTokenInDb = await RefreshToken.findOne({ token: existingRefreshToken, user: userId });

        // If the refresh token doesn't exist in the database, throw an error
        if (!refreshTokenInDb) {
            throw new Error('Refresh token does not exist in DB');
        }

        // Generate new access and refresh tokens
        const { access_token, refresh_token } = encode({ email, userId });

        // Save the new refresh token in the database and delete the old one
        const newRefreshToken = new RefreshToken({
            token: refresh_token,
            user: userId
        });

        await newRefreshToken.save();
        await RefreshToken.deleteOne({
            token: existingRefreshToken,
            user: userId
        });

        // Send the new tokens to the client in cookies
        res.cookie('accessToken', access_token, { httpOnly: true, maxAge: 15 * 60 * 1000, path: '/api' }); // 15 minutes
        res.cookie('refreshToken', refresh_token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, path: '/api' }); //7 days

        // Return the user info and new tokens to the client
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }

        res.json({
            tokens: { access_token, refresh_token },
            payload: {
                user: {
                    _id: user._id,
                    userName: user.userName,
                    email: user.email,
                    profileImage: user.profileImage
                }
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to refresh token' });
    }
}

// Register a new user
const register = async (req, res) => {
    const { firstName, lastName, email, password, birthdate, userName } = req.body;
    const profileImage = req.file.path;
    const hash = bcrypt.hashSync(password, 5);

    try {
        const user = new User({
            firstName,
            userName,
            lastName,
            email,
            password: hash,
            birthdate,
            profileImage
        });

        // Save the new user and return their info to the client
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: `Failed to register user ${error}` });
        console.log(error);
    }
}

// Get the logged-in user's info
const getUserInfo = async (req, res) => {
    const userId = req.user.userId;

    try {
        const user = await User.findById(userId)
            .select('firstName lastName email birthdate profileImage')
            .exec()

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch {
        res.status(500).json({ message: 'Failed to get user info' });
    }
}

// Log out a user
const logout = (req, res) => {
    // Clear the access and refresh token cookies
    res.cookie('accessToken', '', { maxAge: 0, httpOnly: true, path: '/api' });
    res.cookie('refreshToken', '', { maxAge: 0, httpOnly: true, path: '/api' });

    res.status(200).json('Logged out');
}

module.exports = {
    login,
    register,
    getUserInfo,
    refreshToken,
    logout
}
