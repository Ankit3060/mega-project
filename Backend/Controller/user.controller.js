import { User } from "../Models/userModel.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

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


export const getAllUser = async(req,res)=>{
  const user = await User.find({accountVerified:true}).select("-refreshToken");
  return res.status(200).json({
  statusCode: 200,
  success: true,
  message: "User detail fetched successfully",
  user
  })
}


export const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    statusCode: 200,
    success: true,
    message: "User detail fetched successfully",
    user: req.user,
  });
};
