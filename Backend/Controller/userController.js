import { User } from "../Models/userModel.js";
import bcrypt from "bcrypt";
import { sendVerificationCode } from "../Utils/sendVerificationCode.js";
import { sendToken } from "../Utils/sendToken.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, userName, password, phone } = req.body;

    if (!fullName || !email || !userName || !password || !phone) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "All fields are required",
      });
    }

    const isUserExists = await User.findOne({
      $or: [{ email }, { userName }],
    });
    if (isUserExists) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "User already exists with this email or username",
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Please provide a valid email address",
      });
    }

    const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
    if (!usernameRegex.test(userName)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message:
          "Username can only contain letters, numbers, underscores, and hyphens",
      });
    }

    if (password.length < 6 || password.length > 20) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Password must be between 6 to 20 characters",
      });
    }

    let avatarData = {
      public_id: null,
      url: `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(fullName)}&background=%23ebf4ff&color=%230f4c75&radius=50&fontSize=50`,
    };

    if (req.files && req.files.avatar) {
      const { avatar } = req.files;
      const allowedFormat = ["image/png", "image/jpeg", "image/webp", "image/jpg",];
      if (!allowedFormat.includes(avatar.mimetype)) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Invalid image format",
        });
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        {
          folder: "Mega_Project",
        }
      );

      if (!cloudinaryResponse || cloudinaryResponse.error) {
        return res.status(500).json({
          status: 500,
          success: false,
          message: "Cloudinary upload failed",
        });
      }

      avatarData = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      userName,
      password: hashedPassword,
      phone,
      avatar: avatarData
    });

    const verificationCode = await user.generateVerificationCode();

    await user.save({ validateModifiedOnly: true });

    sendVerificationCode(verificationCode, email, res);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.verificationCode !== Number(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const currentTime = Date.now();
    const otpExpirationTime = new Date(user.verificationCodeExpires).getTime();

    if (currentTime > otpExpirationTime) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;

    await user.save({ validateModifiedOnly: true });

    sendToken(user, 200, "Account verified successfully", res);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const resendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const user = await User.findOne({ email: email, accountVerified: false });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found or Account verified successfully",
      });
    }

    const verificationCode = await user.generateVerificationCode();

    await user.save({ validateModifiedOnly: true });

    sendVerificationCode(verificationCode, email, res);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, userName, password } = req.body;
    if (!email && !userName) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Email or Username are required",
      });
    }
    if (!password) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Password is required",
      });
    }

    const query = email ? { email } : { userName };

    const user = await User.findOne({
      ...query,
      accountVerified: true,
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

    sendToken(user, 200, "Login successful", res);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const logoutUser = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .json({
        status: 200,
        success: true,
        message: "Logout successful",
      });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const updateUserDetails = async (req, res) => {
  const { userId } = req.params;
  const { userName, phone, fullName } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "User not found"
      });
    }

    const checkUserName = await User.findOne({ userName, _id: { $ne: userId } });
    if (checkUserName) {
      return res.status(409).json({
        status: 409,
        success: false,
        message: "Username already exists"
      });
    }

    const checkPhoneNumber = await User.findOne({ phone, _id: { $ne: userId } });
    if (checkPhoneNumber) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Phone number already exists"
      });
    }

    if (req.files && req.files.avatar) {
      const { avatar } = req.files;
      const allowedFormat = ["image/png", "image/jpeg", "image/webp", "image/jpg",];
      if (!allowedFormat.includes(avatar.mimetype)) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Invalid image format",
        });
      }

      if (user.avatar?.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        {
          folder: "Mega_Project",
        }
      );

      if (!cloudinaryResponse || cloudinaryResponse.error) {
        return res.status(500).json({
          status: 500,
          success: false,
          message: "Cloudinary upload failed",
        });
      }

      user.avatar = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    }


    if (req.files && req.files.coverImage) {
      const { coverImage } = req.files;
      const allowedFormat = ["image/png", "image/jpeg", "image/webp", "image/jpg",];
      if (!allowedFormat.includes(coverImage.mimetype)) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Invalid image format",
        });
      }

      if (user.coverImage?.public_id) {
        await cloudinary.uploader.destroy(user.coverImage.public_id);
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(
        coverImage.tempFilePath,
        {
          folder: "Mega_Project",
        }
      );

      if (!cloudinaryResponse || cloudinaryResponse.error) {
        return res.status(500).json({
          status: 500,
          success: false,
          message: "Cloudinary upload failed",
        });
      }

      user.coverImage = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    }

    if (userName) user.userName = userName;
    if (phone) user.phone = phone;
    if (fullName) user.fullName = fullName;


    await user.save({ validateModifiedOnly: true });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "User details updated successfully",
      user
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error"
    });
  }
}


export const updatePassword = async (req, res) => {
  const { userId } = req.params;
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Invalid user ID format"
    });
  }

  if (!oldPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "All fields are required"
    });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "New password and confirm password do not match"
    });
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character"
    });
  }

  try {
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Old password is incorrect"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    console.error('Password update error:', error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error"
    });
  }
}