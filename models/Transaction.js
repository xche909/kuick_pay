const { model, Schema } = require("mongoose");

const transactionSchema = new Schema({
    senderUsername: String,
    receiverUsername: String,
    sender: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    amount: Number,
    createdAt: String,
    senderAccountId: String,
    receiverAccountId: String,
    senderAccount: {
        type: Schema.Types.ObjectId,
        ref: "accounts"
    },
    receiverAccount: {
        type: Schema.Types.ObjectId,
        ref: "accounts"
    },
});

module.exports = model("Transaction", transactionSchema);