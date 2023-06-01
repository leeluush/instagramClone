const { verifyAccessToken, encode, verifyRefreshToken } = require("../services/jwt.service");
const {ninetyDays} = require('../config')
const UserToken = require('../models/user-token')

async function verifyUser(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'not authorized' })
      
    }

    const user = verifyRefreshToken(token)
    const creationTime = user.iat;
    const currentTime = Math.floor(Date.now() / 1000);

    if (currentTime - creationTime > 10 * 60) {
      const isTokenInDB = await UserToken.exists({ user: user._id, token: user.identifier });

      if (isTokenInDB) {
        const { identifier, refresh_token } = encode(user);

        await UserToken.updateOne(
          { user: user._id, token: user.identifier },
          { $set: { token: identifier } }
        )

        res.cookie('token', refresh_token, { httpOnly: true, maxAge: ninetyDays, path: '/api' })

      } else {
        console.log('Token not in DB');
        res.cookie('token', '', { httpOnly: true, maxAge: 0, path: '/api' })

        return res.status(401).json({ message: 'not connected' });
      }
    }

    req.user = user;
    next();
  } catch {
    res.cookie('token', '', { httpOnly: true, maxAge: 0, path: '/api' })
    res.status(401).json({ message: 'not authorized' });
  }
}





//   const authHeader = req.headers['authorization'] || ''
//   const token = authHeader.split(' ')[1];

//   try {
//     const user = verifyAccessToken(token);
//     req.user = user;
//     next();
//   } catch {
//     res.status(401).json({message: 'not authorized'});
//   }
// }

module.exports = verifyUser 