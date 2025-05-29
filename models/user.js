const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");




const userSchema = new Schema({
     email: {
        type: String,
        required: true,
        unique: true
    },
  
    listings: [
        {
        type: Schema.Types.ObjectId,
        ref: "Listing"
        }
    ]
    });

// Add passport-local-mongoose plugin to the user schema
    userSchema.plugin(passportLocalMongoose);


const User = mongoose.model("User", userSchema);
module.exports = User;