import { User } from "../Models/userModel.js";
import bcrypt from "bcrypt";
import { sendVerificationCode } from "../Utils/sendVerificationCode.js";
import { sendPasswordResetCode } from "../Utils/sendPasswordResetCode.js"
import { sendToken } from "../Utils/sendToken.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import crypto from "crypto";
import jwt from "jsonwebtoken"

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, userName, password, phone } = req.body;

    if (!fullName || !email || !userName || !password || !phone) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "All fields are required",
      });
    }

    const isUserExists = await User.findOne({
      $or: [{ email }, { userName }, {phone}],
    });
    if (isUserExists) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "User already exists with this email or username or phone",
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Please provide a valid email address",
      });
    }

    const usernameRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_.-]+$/;
    if (!usernameRegex.test(userName)) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message:
          "Username can only contain letters, numbers, underscores, and hyphens",
      });
    }

    const phoneRegex = /^(?!(\d)\1{9})[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message:
          "Phone number must be 10 digits long and start with 6, 7, 8, or 9 and cannot be all the same digit",
      });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#_.-])[A-Za-z\d@$!%*?&^#_.-]{6,20}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message:
          "Password must include uppercase, lowercase, number, special character and be 6–20 characters long",
      });
    }

    let avatarData = {
      public_id: null,
      url: `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(fullName)}&background=%23ebf4ff&color=%230f4c75&radius=50&fontSize=50`,
    };

    if (req.files && req.files.avatar) {
      const { avatar } = req.files;
      const allowedFormat = ["image/png", "image/jpeg", "image/webp", "image/jpg", "image/svg+xml"];
      if (!allowedFormat.includes(avatar.mimetype)) {
        return res.status(400).json({
          statusCode: 400,
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
          statusCode: 500,
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

    await user.save();

    sendVerificationCode(verificationCode, email, res);
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: "Email and OTP are required",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "User not found",
      });
    }

    if(user.otpFailedAttempt>=5){
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Too many failed OTP attempts. Please try 1hr later."
      })
    }

    if (!user.verificationCode || user.verificationCode !== Number(otp)) {
      user.otpFailedAttempt += 1;
      user.lastOtpTime = Date.now();
      await user.save();
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Invalid OTP",
      });
    }


    const currentTime = Date.now();
    const otpExpirationTime = new Date(user.verificationCodeExpires).getTime();

    if (currentTime > otpExpirationTime) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "OTP has expired",
      });
    }

    user.accountVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    user.otpFailedAttempt = undefined;

    await user.save({ validateModifiedOnly: true });

    sendToken(user, 200, "Account verified successfully", res);
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const resendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: "Email is required",
    });
  }

  try {
    const user = await User.findOne({ email: email, accountVerified: false });
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "User not found or account already verified"
      });
    }

    if(user.otpGenerated>=5){
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Too many OTP generated. Please try 1hr later."
      })
    }

    const verificationCode = await user.generateVerificationCode();
    user.otpGenerated += 1;
    user.lastOtpTime = Date.now();

    await user.save();

    sendVerificationCode(verificationCode, email, res);
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
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
        statusCode: 400,
        success: false,
        message: "Email or Username are required",
      });
    }
    if (!password) {
      return res.status(400).json({
        statusCode: 400,
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
        statusCode: 404,
        success: false,
        message: "User not found or account not verified"
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        message: "Invalid credentials",
      });
    }

    await sendToken(user, 200, "Login successful", res);
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const logoutUser = async (req, res) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
    }

    return res.status(200).cookie("refreshToken", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    }).cookie("accessToken","",{
      expires: new Date(Date.now()),
      httpOnly: true,
    })
      .json({
        statusCode: 200,
        success: true,
        message: "Logout successful",
      });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const updateUserDetails = async (req, res) => {
  const { userId } = req.params;
  const { userName, phone, fullName } = req.body;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: "Invalid user ID format"
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "User not found"
      });
    }


    if (userName) {
      const checkUserName = await User.findOne({ userName, _id: { $ne: userId } });
      if (checkUserName) {
        return res.status(409).json({
          statusCode: 409,
          success: false,
          message: "Username already exists"
        });
      }

      const usernameRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_.-]+$/;
      if (!usernameRegex.test(userName)) {
        return res.status(400).json({
          statusCode: 400,
          success: false,
          message:
            "Username must contain letters and numbers, and can include _, ., -",
        });
      }

      user.userName = userName;
    }


    if (phone) {
      const checkPhoneNumber = await User.findOne({ phone, _id: { $ne: userId } });
      if (checkPhoneNumber) {
        return res.status(400).json({
          statusCode: 400,
          success: false,
          message: "Phone number already exists"
        });
      }

      const phoneRegex = /^(?!(\d)\1{9})[6-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          statusCode: 400,
          success: false,
          message:
            "Phone number must be 10 digits long and start with 6, 7, 8, or 9 and cannot be all the same digit",
        });
      }

      user.phone = phone;
    }


    if (req.files && req.files.avatar) {
      const { avatar } = req.files;
      const allowedFormat = ["image/png", "image/jpeg", "image/webp", "image/jpg", "image/svg+xml"];
      if (!allowedFormat.includes(avatar.mimetype)) {
        return res.status(400).json({
          statusCode: 400,
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
          statusCode: 500,
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
          statusCode: 400,
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
          statusCode: 500,
          success: false,
          message: "Cloudinary upload failed",
        });
      }

      user.coverImage = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    }

    if (fullName) user.fullName = fullName;


    await user.save({ validateModifiedOnly: true });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "User details updated successfully",
      user
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
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
      statusCode: 400,
      success: false,
      message: "Invalid user ID format"
    });
  }

  if (!oldPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: "All fields are required"
    });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: "New password and confirm password do not match"
    });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#_.-])[A-Za-z\d@$!%*?&^#_.-]{6,20}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: "Password must include uppercase, lowercase, number, special character and be 6–20 characters long",
    });
  }

  try {
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Old password is incorrect"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save({ validateModifiedOnly: true });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    console.error('Password update error:', error);
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error"
    });
  }
}


export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: "Email is required to reset the password"
    })
  }

  try {
    const user = await User.findOne({ email, accountVerified: true });
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "User not found"
      });
    }

    if(user.resetTokenGeneratedTime>=5){
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Too many Token generated. Please try 1hr later."
      })
    }

    const resetToken = user.getResetPasswordToken();
    user.resetTokenGeneratedTime += 1;
    user.lastResetTokenTime = Date.now();
    await user.save();

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    sendPasswordResetCode(resetPasswordUrl, email, res);
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error sending password reset code"
    });
  }
}


export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const resetPasswordToken = crypto
                                  .createHash("sha256")
                                  .update(token)
                                  .digest("hex");

    const user = await User.findOne({ resetPasswordToken, resetPasswordTokenExpire: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Reset token is invalid or expired"
      })
    }

    const { newPassword, confirmNewPassword } = req.body;
    if (!newPassword || !confirmNewPassword) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Password and confirm password should not be empty"
      })
    }

    if (newPassword != confirmNewPassword) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Password and confirm password donot match"
      })
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#_.-])[A-Za-z\d@$!%*?&^#_.-]{6,20}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Password must include uppercase, lowercase, number, special character and be 6–20 characters long",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordTokenExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    sendToken(user, 200, "Password reset successfully", res)
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error in resetting password"
    })
  }

}


export const refreshAccessToken = async(req, res)=>{
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if(!incomingRefreshToken){
    return res.status(401).json({
      statusCode: 401,
      success: false,
      message: "unauthorized request"
    })
  }

  try {
    const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_KEY);

    const userId = decoded?.id || decoded?._id
    const user = await User.findById(userId);
    if(!user){
      return res.status(400).json({
        statusCode:400,
        success: false,
        message: "Invalid refresh token"
      })
    }

    if(incomingRefreshToken !== user?.refreshToken){
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Referesh Token is expired or invalid"
      })
    }

    sendToken(user, 200, "Token created successful",res);

  } catch (error) {
    return res.status(401).json({
        statusCode: 401,
        success: false,
        message: "Invalid or expired refresh token"
      })
  }
}