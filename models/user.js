const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../utils/const');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    photoUrl: {
        type: String,
        trim: true,
        default: 'https://cdn.vectorstock.com/i/1000v/92/16/default-profile-picture-avatar-user-icon-vector-46389216.jpg'
    },
    age: {
        type: Number,
        min: 18
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: (value) => {
            if (!validator.isEmail(value)) {
                throw new Error('Please enter a valid email id.');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        validate: (value) => {
            if (!['male', 'female', 'others'].includes(value)) {
                throw new Error('gender data is not allowed');
            }
        },
        required: true
    },
    skills: {
        type: [String],
    }
},
    {
        timestamps: true
    });

// Shcema methods, which can be accessed on any instance of this model.
userSchema.methods.getPasswordHashed = async function (password) {
    const user = this;
    return await bcrypt.compare(password, user.password);
};
userSchema.methods.getJwt = function (expireTime) {
    const user = this;
    const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: expireTime || '1d' });
    return token;
}

module.exports = mongoose.model("User", userSchema);