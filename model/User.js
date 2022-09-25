const mongoose = require("mongoose");

let UserSchema = new mongoose.Schema({

    login: {
        type: String,
        require: true,
        unique: true,
    }
});

module.exports = mongoose.model("user", UserSchema); 