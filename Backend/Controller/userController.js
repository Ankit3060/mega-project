import { User } from "../Models/userModel.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
    try {
        const { fullName, email, userName, password } = req.body;

        if (!fullName || !email || !userName || !password) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "All fields are required",
            })
        }

        const isUserExists = await User.findOne({ 
            $or:[{email}, {userName}]
         });
        if (isUserExists) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "User already exists with this email or username",
            })
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Please provide a valid email address",
            })
        }

        const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
        if (!usernameRegex.test(userName)) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Username can only contain letters, numbers, underscores, and hyphens",
            })
        }

        if (password.length < 6 || password.length > 20) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Password must be between 6 to 20 characters",
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email,
            userName,
            password: hashedPassword
        })

        await user.save();

        return res.status(201).json({
            status: 201,
            success: true,
            message: "User registered successfully",
            user
        })

    } catch (error) {
        return res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error",
        });
    }
}


export const loginUser = async (req, res)=>{
    try {
        const { email, userName, password } = req.body;
        if(!email || !userName) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Email or Username are required",
            });
        }
        if(!password) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Password is required",
            });
        }

        const user = await User.findOne({
            $or: [{ email }, { userName }]
        }).select("+password");
        if (!user) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "User not found",
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                status: 401,
                success: false,
                message: "Invalid credentials",
            });
        }

        user.password = undefined;

        return res.status(200).json({
            status: 200,
            success: true,
            message: "Login successful",
            user
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error",
        });
    }
}