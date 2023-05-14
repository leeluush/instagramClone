const {verifyAccessToken, verifyRefreshToken,encode} = require("../services/jwt.service");
const UserToken = require('../models/user-token')

async function verifyUser(req, res, next) {
  console.log('Checking token...')
  try {
    const token = req.cookies.token;
    if (!token) {
      console.log('No token found');
      return res.status(401).json({message:'not connected'})
    }

    const user = verifyAccessToken(token)
    const creationTime = user.iat;
    const currentTime = Math.floor(Date.now() / 1000);

    if (currentTime - creationTime > 10 * 60) {
      const isTokenInDB = await UserToken.exists({ user: user._id, token: user.identifier });
    
      if (isTokenInDB) {
        const newTokens = encode(user);
        res.json({tokens:newTokens})

      } else {
        console.log('Token not in DB');
        return res.status(401).json({ message: 'not connected' });
      }
    }

    req.user = user;
    next();
  } catch {
    console.log('Error verifying token')
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