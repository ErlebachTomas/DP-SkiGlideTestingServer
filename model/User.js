const mongoose = require("mongoose");

let UserSchema = new mongoose.Schema({

    login: {
        type: String,
        require: true,
        unique: true,
    },
    updated_at: {
        type: String,
        require: false,
    }
});

module.exports = mongoose.model("user", UserSchema); 