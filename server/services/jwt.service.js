const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'my access token secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'my refresh token secret';

function encode(payload) {
  const identifier = (Math.random() * Math.random()).toString();
  return {
    identifier,
    access_token: jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' }),
    refresh_token: jwt.sign({ ...payload, identifier }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' }),

  };
}

function verifyAccessToken(token) {
  console.log("Verifying Token: ", token);

  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
}

module.exports = {
  encode,
  verifyAccessToken,
  verifyRefreshToken,
};
