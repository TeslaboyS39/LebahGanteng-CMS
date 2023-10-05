const jwt = require('jsonwebtoken');
const ini_kunci = process.env.JWT_SECRET;

const createToken = (payload) => jwt.sign(payload, ini_kunci);

// untuk mendecode token
const verifyToken = (token) => jwt.verify(token, ini_kunci);

module.exports = {
    createToken,
    verifyToken
}