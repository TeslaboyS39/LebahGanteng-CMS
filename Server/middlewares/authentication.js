const { verifyToken } = require("../helpers/jwt");
const { User } = require('../models');

async function authentication(req, res, next) {
    try {
        console.log(req.headers);
        // proses pengecekan apakah client mengirimkan headers access_token
        const { access_token } = req.headers;
        if (!access_token) {
            throw { name: 'unauthenticated' }
        }

        // proses decoding access_token
        const payload = verifyToken(access_token);
        // console.log(payload, '<<<<THIS IS PAYLOAD');

        // proses pengecekan apakah user ada di db atau tidak
        const findUser = await User.findByPk(payload.id)
        if (!findUser) {
            throw { name: 'unauthenticated' }
        }

        // proses penyimpanan data ke req (sementara)
        // console.log(findUser, '<<< INI USER')
        req.user = {
            id: findUser.id,
            role: findUser.role,
            email: findUser.email
        }

        next();        
    } catch (error) {
        console.log(error, '<<<<< ini bre');
        next(error);
    }
}

module.exports = authentication;