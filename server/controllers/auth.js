const User = require("../models/user");
const { encode, verifyRefreshToken } = require("../services/jwt.service");
const UserToken = require("../models/user-token");
const bcrypt = require("bcrypt");
const ninetyDays = 90 * 24 * 60 * 60 * 1000



async function login(req, res) {
    const { email, password, userName, } = req.body;
    try {
        const user = await User.findOne({
            email: email,
        }).exec();

        if (user) {

            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(401).json({ message: 'not authorized' });
            }

            const { identifier, ...tokens } = encode({ email, userName,  userId: user._id });
            res.cookie('token', tokens.refresh_token, { httpOnly: true, maxAge: ninetyDays, path: '/api' })
    
            const userToken = new UserToken({
                user: user._id,
                token: identifier
            })

            await userToken.save();

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
                    token: tokens
                });
        } else {
            res.status(401).json({ message: 'not authorized' })
        }
    } catch {
        res.status(500).json({ message: 'failed to login' });
    }
}


async function refreshToken(req, res) {
    const existingToken = req.cookies['token'] || '';   

    try {
        const { userId, email, firstName, lastName, identifier: existingIdentifier } = verifyRefreshToken(existingToken);
        console.log('_id:', userId)
        const isExists = await UserToken.exists({
            user: _id,
            token: existingIdentifier
        });

        if (!isExists) {
            throw new Error('token does not exist in db');
        }

        const user = {
            _id,
            email,
            firstName,
            lastName
        };
        const { identifier, ...tokens } = encode(user);

        // 1. insert the new token to db
        const userToken = new UserToken({
            user: _id,
            token: identifier
        })
        await userToken.save();
        // 2. remove the old token from db
        await UserToken.deleteOne({
            user: _id,
            token: existingIdentifier
        });

        res.cookie('access_token', tokens.access_token, { httpOnly: true, maxAge: 1000 * 60 * 60, path: '/api' });
        res.json({
            ...tokens,
            payload: {
                user,
            }
        });
    } catch (err) {
        console.log(err);
        res.status(401).json({ message: 'not authorized' });
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
            .select('firstName lastName email birthdate')
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










module.exports = {
    login,
    register,
    getUserInfo,
    refreshToken,
    getUserByUserId
}