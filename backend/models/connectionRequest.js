const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        ref: "User" // reference to User collection just like sql joins
    },
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        ref: "User" // reference to User collection just like sql joins
    },
    status: {
        type: mongoose.Schema.Types.String,
        required: true,
        enum: {
            values: ["interested", "ignored", "accepted", "rejected"],
            message: "{VALUE} is invalid status type!"
        }
    }
}, { timestamps: true });

connectionRequestSchema.pre('save', function(next) {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("You can't send a request to yourself!")
    }
    next();
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
