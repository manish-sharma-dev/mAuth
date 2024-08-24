import mongoose,{ Schema } from "mongoose";

const UserSchema = new Schema({
    name : {
        type : String
    },
    email : { 
        type : String,
        required : true,
        unique : true
    },
    password : { 
        type : String
    },
    googleId: { 
        type: String,
        unique: true // Ensures unique Google IDs
    },
    refreshToken : {
        type : String
    }

},{ timestamps : true })

export const User = mongoose.model("User",UserSchema)