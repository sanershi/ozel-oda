let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let SecretRoom = Schema({
    user: {type: String, default: ""},
    guild: {type: String, default: ""},
    channel: { type: String, default: "" },
    channelCapacity: { type: Number, default: 0 },
    channelPassword: { type: String, default: "" },
    channelName: { type: String, default: "" },
    active: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now() },
    channelAuthorized: { type: Array, default: [] },
    channelUnAuthorized: { type: Array, default: [] }
})

module.exports = mongoose.model("SecretRoom", SecretRoom)