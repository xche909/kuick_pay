const { model, Schema } = require("mongoose");

const accountSchema = new Schema({
    username: String,
    name: String,
    createdAt: String,
    balance: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    }
});

module.exports = model("Account", accountSchema);