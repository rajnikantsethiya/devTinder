const express = require('express');
const router = express.Router();
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');
const { userAuth } = require('../utils/middleware');
const { USER_SAFE_DATA } = require('../utils/const');

router.get('/feed', userAuth, async (req, res) => {
  const currentUser = req.user;
  const page = parseInt(req.query.page) || 1;
  let limit = 10;
  const skip = (page - 1) * limit;
  limit = limit > 50 ? 50 : limit;
  const requests = await ConnectionRequest.find({
    $or: [
      { fromUserId: currentUser._id }, {
        toUserId: currentUser._id
      }
    ]
  });
  const hideUsers = new Set();
  requests.forEach(req => {
    hideUsers.add(req.fromUserId.toString());
    hideUsers.add(req.toUserId.toString());
  });
  const feedUsers = await User.find({
    $and: [
      { _id: { $nin: Array.from(hideUsers) } },
      { _id: { $ne: { _id: currentUser._id } } }
    ]
  }).select(USER_SAFE_DATA).skip(skip).limit(limit);;
  return res.status(200).send(feedUsers);
});
module.exports = { feedRouter: router };