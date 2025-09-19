const express = require('express');
const bcrypt = require('bcrypt');
const { validateSignup } = require('../utils/validate');
const User = require('../models/user');
const { userAuth } = require('../utils/middleware');

const authRouter = express.Router();

authRouter.post("/auth/signup", async (req, res) => {
    try {
        validateSignup(req);
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });
        await user.save();
        return res.status(200).send("User added successfully");
    } catch (err) {
        return res.send("SIGNUP Failed: " + err.message)
    }
});

authRouter.post('/auth/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error('Please enter the valid credentials')
        }

        const isValid = await user.getPasswordHashed(password);
        if (isValid) {
            const token = await user.getJwt();
            res.cookie('token', token, { expires: new Date(Date.now() + 900000), httpOnly: true });
            return res.status(201).send('Login successful!!!');
        } else {
            throw new Error('Please enter the valid credentials')
        }
    } catch (err) {
        return res.status(400).send(err.message);
    }
});

authRouter.post('/auth/logout', userAuth, async (req, res) => {
    try {
        res.cookie('token', null, {
            expires: new Date(Date.now())
        })
        console.log();

        return res.status(200).send('User logged out successfully!');
    }
    catch (err) {
        return res.status(401).send(err.message);
    }
});

authRouter.patch('/auth/forgotPassword', async (req, res) => {
    try {
        const { emailId, password, newPassword } = req.body;
        const user = await User.findOne({ emailId });

        const isValidLogin = await user.getPasswordHashed(password);
        if (isValidLogin) {
            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();
            return res.status(200).send(`Welcome ${user.firstName}, Your password is changed successfully !`)
        } else {
            throw new Error('Invalid credentials, Please try again!')
        }
    } catch (err) {
        return res.status(400).send(err.message);
    }
})

module.exports = { authRouter }