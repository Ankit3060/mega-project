import mongoose, { mongo } from "mongoose";
import  jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    fullName : {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    avatar: {
        public_id: String,
        url : String,
        required: false
    },
    coverImage: {
        public_id: String,
        url: String,
        required: false
    },
    phone: {
        type: Number,
        required: false,
        unique: true
    },
    role: {
        type: String,
        enum: ["User", "Admin"],
        default: "User"
    },
    verificationCode: Number,
    verificationCodeExpires: Date,
    accountVerified: {
        type: Boolean,
        default: false
    }

},{timestamps: true});


userSchema.methods.generateVerificationCode = function(){
    function generateRandomFiveDigitNumber(){
        const firstDigit = Math.floor(Math.random()*9)+1;
        const remainingDigit = Math.floor(Math.random()*10000).toString().padStart(4,0);
        return parseInt(firstDigit+remainingDigit);
    }

    const verificationCode = generateRandomFiveDigitNumber();
    this.verificationCode = verificationCode;
    this.verificationCodeExpires = Date.now()+15*60*1000;

    return verificationCode;
}


userSchema.methods.generateToken = function (){
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIRE
        }
    );
}


export const User = mongoose.model("User", userSchema);