const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SECRET_KEY } = require('./const');

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            res.status(401).json('Invalid token, Please login again');
        } else {
            const tokenCookie = jwt.verify(token, SECRET_KEY);
            const user = await User.find({ _id: tokenCookie._id });
            if (!user || user?.length === 0) {
                throw new Error('No users found with this token!');
            } else {
                req.user = user[0];
                next();
            }
        }
    } catch (err) {
        return res.status(400).send(err.message);
    }
};

module.exports = {
    userAuth
};