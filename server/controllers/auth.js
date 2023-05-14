const User = require('../models/user');
const { encode } = require("../services/jwt.service");
const UserToken = require("../models/user-token");
const bcrypt = require('bcrypt');
const ninetyDays = 90 * 24 * 60 * 60 * 1000


async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email }).exec();

        if (user) {
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(401).json({ message: 'not authorized' });
            }
            const { _id, userName, firstName, lastName, birthDate } = user;
            const payload = { email, firstName, lastName, birthDate, userId: _id };
    

            const { identifier, ...tokens } = encode(payload);
            res.cookie('token', tokens.refresh_token, { httpOnly: true, maxAge: ninetyDays, path: '/api' });

            const userToken = new UserToken({
                user: _id,
                token: identifier
            })

            await userToken.save();

            res.json({
                payload: {
                    user: {
                        userName,
                        firstName,
                        lastName,
                        email,
                        birthDate

                    },
                    token: tokens
                }
            });
        } else {
            res.status(401).json({ message: 'not authorized' })
        }
    } catch (error) {
        res.status(500).json({ message: 'failed to login', error });
    }
}


async function register(req, res) {
    const { userName, firstName, lastName, email, password, birthDate } = req.body;
    const hash = bcrypt.hashSync(password, 10)

    try {
        const existingUser = await User.findOne({ email: email }).exec();
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' })
        }

        const user = new User({
            userName,
            firstName,
            lastName,
            email,
            password: hash,
            birthDate
        })

        await user.save();
        const { identifier, ...tokens } = encode({ userName, email, firstName, lastName, birthDate, userId: user._id });
        res.cookie('token', tokens.refresh_token, { httpOnly: true, maxAge: ninetyDays, path: '/api' })

        const userToken = new UserToken({
            user: user._id,
            token: identifier
        });

        await userToken.save();
        res.json({
            payload: {
                user: {
                    firstName,
                    lastName,
                    email,
                    birthDate,
                    userName
                },
                tokens: tokens
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to register user', error: `${error}` });
    }
}

async function refreshToken(req, res) {
    const authHeader = req.headers['authorization'] || ''
    const existingToken = authHeader.split(' ')[1];
  
    try {
      const { _id, email, firstName, lastName, identifier: existingIdentifier } = verifyRefreshToken(existingToken);
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


module.exports = {
    register,
    login,
    getUserInfo,
    refreshToken
}