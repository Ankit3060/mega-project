import express from 'express';
import { 
    registerUser, 
    verifyOtp, 
    loginUser, 
    resendOtp,
    logoutUser,
    updateUserDetails,
    updatePassword,
    forgetPassword,
    resetPassword
} from '../Controller/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.put('/update-details/:userId', updateUserDetails);
router.put('/update-password/:userId', updatePassword);
router.post('/forget-password', forgetPassword);
router.put('/reset-password/:token', resetPassword)

export default router;