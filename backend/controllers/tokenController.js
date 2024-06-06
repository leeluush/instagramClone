const jwt = require('jsonwebtoken');
const util = require('util');
const AppError = require('../middleware/appError');

const signJWT = util.promisify(jwt.sign);
const verifyJWT = util.promisify(jwt.verify);

async function createToken(id, secret, expiresIn) {
  const token = await signJWT({ id }, secret, { expiresIn });
  if (!token) {
    throw new AppError('Could not sign the token', 500);
  }
  return token;
}

async function verifyToken(token, secret) {
  const decodedToken = await verifyJWT(token, secret);
  if (!decodedToken) {
    throw new AppError('Invalid token', 401);
  }
  return decodedToken;
}

exports.createToken = createToken;
exports.verifyToken = verifyToken;

exports.verifyAccessToken = async (token) =>
  verifyToken(token, process.env.ACCESS_JWT_SECRET);

exports.verifyRefreshToken = async (token) =>
  verifyToken(token, process.env.REFRESH_JWT_SECRET);

exports.signAccessToken = async (id) =>
  createToken(
    id,
    process.env.ACCESS_JWT_SECRET,
    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  );
exports.signRefreshToken = async (id) =>
  createToken(
    id,
    process.env.REFRESH_JWT_SECRET,
    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  );
