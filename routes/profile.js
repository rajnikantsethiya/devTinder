const express = require('express');
const { userAuth } = require('../utils/middleware');
const { validateUpdatedData } = require('../utils/validate');

const profileRouter = express.Router();

// get a single user
profileRouter.get('/get', userAuth, async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).send(user);
    } catch (err) {
        return res.status(401).send(err.message);
    }
});

profileRouter.patch('/edit', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const isAllowed = validateUpdatedData(req);
        if (isAllowed) {
            Object.keys(req.body).forEach(key =>
                loggedInUser[key] = req.body[key]
            );
            await loggedInUser.save();
            return res.status(200).json({ message: `Hi ${loggedInUser.firstName}, Your profile is updated!` })
        } else {
            throw new Error('Required updates are not allowed!')
        }
    } catch (err) {
        return res.status(400).send(err.message);
    }
})

module.exports = { profileRouter };