import express from 'express';
import { 
    registerUser, 
    verifyOtp, 
    loginUser, 
    resendOtp,
    logoutUser,
    forgetPassword,
    resetPassword,
    refreshAccessToken,
} from '../Controller/auth.controller.js';
import { isAuthenticated } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', loginUser);
router.post('/logout',isAuthenticated, logoutUser);
router.post('/forget-password', forgetPassword);
router.put('/reset-password/:token', resetPassword);
router.post('/refresh-token',refreshAccessToken);

export default router;