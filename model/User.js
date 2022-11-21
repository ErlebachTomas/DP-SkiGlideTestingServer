const mongoose = require("mongoose");

let UserSchema = new mongoose.Schema({

    user_id: {
        type: String,
        require: true,
       // unique: true,
    },
    email: {
        type: String,
        require: true,        
    },
    name: {
        type: String,
        require: true, 
    },    
    updated_at: {
        type: String,
        require: false,
    }
});

module.exports = mongoose.model("User", UserSchema); 