const mongoose = require("mongoose");

const UserprofileSchema = {
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    gender: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    }
}
const UserProfile = new mongoose.model("userprofile", UserprofileSchema);
module.exports = UserProfile;

