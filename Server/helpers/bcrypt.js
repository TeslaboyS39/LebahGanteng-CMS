const bcrypt = require('bcryptjs');

const hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

const comparePasswords = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
};

module.exports = {
    hashPassword,
    comparePasswords
};