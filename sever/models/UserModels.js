import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { genSalt } from "bcrypt";
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: false // Remove the unique property
    },
    image: {
        type: String,
        required: false
    },
    color: {
        type: Number,
        required: false
    },
    profileSetUp: {
        type: Boolean,
        default: false
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    }
})

//MIDDLEWARE FOR SAVING DATA run before saving data 
UserSchema.pre("save", async function (next) {
    const salt = await genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

const User = mongoose.model('Users', UserSchema);
export default User;
