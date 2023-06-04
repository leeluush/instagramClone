const User = require("../models/user");
const RefreshToken = require('../models/refreshToken');
const { encode, verifyRefreshToken } = require("../services/jwt.service");
const bcrypt = require("bcrypt");


async function login(req, res) {
    const { email, password, userName, } = req.body;

    try {
        const user = await User.findOne({ email: email }).exec();

        if (!user) {
            return res.status(401).json({ message: 'not authorized' });
        }

        let isPasswordCorrect;

        try {
            isPasswordCorrect = await bcrypt.compare(password, user.password);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error when comparing passwords' });
        }

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'not authorized' });
        }


            const { access_token, refresh_token } = encode({ email, userId: user._id });
            const userRefreshToken = new RefreshToken({ token: refresh_token, user: user._id  });
            await userRefreshToken.save();

            res.cookie('accessToken', access_token, { httpOnly: true, maxAge: 15 * 60 * 1000, path: '/api' }) // 15 minutes
            res.cookie('refreshToken', refresh_token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, path: '/api' }) //7 days

            return res.status(200).json
            ({ message: 'Logged in successfully.',
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
            res.status(500).json({ message: 'Faild to login' })
        }
  
    }

    async function refreshToken(req, res) {
        const existingRefreshToken = req.cookies ? req.cookies['refreshToken'] : '';   
    
        try {
            const decoded = verifyRefreshToken(existingRefreshToken);
            if (!decoded) {
                return res.status(401).json({ message: 'Invalid refresh token' });
            }
            const { userId, email } = decoded;
    
            const refreshTokenInDb = await RefreshToken.findOne({ token: existingRefreshToken, user: userId });
    
            if (!refreshTokenInDb) {
                throw new Error('Refresh token does not exist in db');
            }
    
            const { access_token, refresh_token } = encode({ email, userId });
    
            const newRefreshToken = new RefreshToken({
                token: refresh_token,
                user: userId
            });
    
            await newRefreshToken.save();
            await RefreshToken.deleteOne({
                token: existingRefreshToken,
                user: userId
            });
    
            res.cookie('accessToken', access_token, { httpOnly: true, maxAge: 15 * 60 * 1000, path: '/api' }); // 15 minutes
            res.cookie('refreshToken', refresh_token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, path: '/api' }); //7 days
    
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
    

async function register(req, res) {
    const { firstName, lastName, email, password, birthdate,userName,  } = req.body;
    const profileImage = req.file.path
    const hash = bcrypt.hashSync(password, 5)

    //to do add login 

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
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: `failed to register user' ${error}` });
        console.log(error);
    }
}


async function getUserInfo(req, res) {
    const userId = req.user.userId
    try {
        const user = await User.findById(userId)
            .select('firstName lastName email birthdate profileImage')
            .exec()

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' })
        }
    } catch {
        res.status(500).json({ message: 'Failed to get user info' });
    }
}


async function getUserByUserId(req,res) {
    const userId = req.params.userId
    const users = await User.find({user: userId})
    .sort('-created')
    .exec();
    res.json(users)


    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }


}


   function logout (req,res) {
    res.cookie('token', '', { maxAge: 0, httpOnly: true, path: '/api' });
    res.status(200).send('Logged out');
}







module.exports = {
    login,
    register,
    getUserInfo,
    refreshToken,
    getUserByUserId,
    logout
}