const mongoose = require("mongoose");

const UserdataSchema = {
    username: String,
    userprofileid: String,
    total: Number,
    gamescore: []
}
const Userdata = new mongoose.model("userdata", UserdataSchema);
module.exports = Userdata;
