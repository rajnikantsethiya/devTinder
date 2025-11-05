const express = require('express');
// const { userAuth } = require('../utils/middleware');
const { User } = require('../models/user');
const validator = require('validator');
const { userAuth } = require('../utils/middleware');
const ConnectionRequest = require('../models/connectionRequest');
const { USER_SAFE_DATA } = require('../utils/const');

const userRouter = express.Router();

// Delete user
userRouter.delete('/delete', async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ emailId: req.body.emailId });
        if (!user || user?.length === 0) {
            return res.json("No users found");
        }
        return res.json("User deleted successfully");
    } catch (err) {
        console.log(err);
    }
});

// Update user
userRouter.patch('/update/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const data = req.body;
        // Writing API level validations using validator
        if (!validator.isEmail(data.emailId)) {
            throw new Error("Your email Id is not correct !");
        }
        const user = await User.findOneAndUpdate({ _id: userId }, req.body, { runValidators: true });
        if (!user || user?.length === 0) {
            return res.json("No users found");
        }
        return res.json("User updated successfully");
    } catch (err) {
        return res.status(400).json(err.message)
    }
});

// connections -> 
// get all connection where status is accepted
userRouter.get('/connections', userAuth, async (req, res) => {
    try {
        const currentUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [
                { toUserId: currentUser._id, status: 'accepted' },
                { fromUserId: currentUser._id, status: 'accepted' }
            ]
        }).populate('fromUserId', USER_SAFE_DATA);
        if (!connections.length) {
            return res.status(200).json({ message: 'No connections found!', data: [] });
        };
        return res.status(200).json({ message: '', data: connections });
    }
    catch (e) {
        return res.status(400).json(e.message)
    }
});

userRouter.get('/requests', userAuth, async (req, res) => {
    try {
        const currentUser = req.user;
        const requests = await ConnectionRequest.find({
            status: 'interested',
            toUserId: currentUser._id
        }).populate('fromUserId', USER_SAFE_DATA);

        if (!requests.length) {
            return res.status(200).json({ message: 'No requests found!', data: [] });
        };
        return res.status(200).json({ message: '', data: requests });
    }
    catch (e) {
        res.status(400).json(e.message);
    }
})

module.exports = { userRouter };