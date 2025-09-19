const express = require('express');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const { userAuth } = require('../utils/middleware');
const router = express.Router();

// Scenarios covered
// only allowed statues are allowed
// existing request check
// can't request to yourself
// Request sent/ignored successfully
// can't send request to random id
router.post("/connection/send/:status/:userId", userAuth, async (req, res) => {
    try {
        const currentUser = req.user;
        const { userId, status } = req.params;
        const allowedStatues = ['interested', 'ignored'];
        if (!allowedStatues.includes(status.toLowerCase())) {
            return res.status(400).send({
                message: `Invalid status type: ${status}`
            });
        };

        const toUser = await User.findById(userId);
        if (!toUser) {
            return res.status(400).send('No user found!');
        }
        if (toUser._id === currentUser._id) {
            return res.status(400).send({
                message: "You can't send request to yourself!"
            });
        }
        const requestExists = await ConnectionRequest.findOne({
            $or: [{ toUserId: userId, fromUserId: currentUser._id }, {
                toUserId: currentUser._id, fromUserId: userId
            }]
        });
        console.log(requestExists);

        if (requestExists) {
            return res.status(400).send({
                message: "You have already sent a request!"
            })
        } else {
            const request = new ConnectionRequest({
                toUserId: userId,
                fromUserId: currentUser._id,
                status
            })
            await request.save();
            return res.status(200).send({
                message: "Your connection request sent successfully!"
            })
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post("/connection/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const allowedStatus = ['accepted', 'rejected'];
        const { status, requestId } = req.params;
        const currentUser = req.user;
        if (!allowedStatus.includes(status)) {
            return res.status(400).send({ message: 'Invalid status type!' });
        };
        const request = await ConnectionRequest.findOne({
            _id: requestId,
            status: 'interested',
            toUserId: currentUser._id
        });
        if (!request) {
            return res.status(200).send({ message: "No request found!" });
        };

        request.status = 'accepted';
        request.save();
        return res.status(200).send({ message: 'Your request is accepted!' })
    } catch (e) {
        return res.status(400).send(e.message);
    }
})

module.exports = { connectionRouter: router };