import express from 'express';
import { 
    registerUser, 
    verifyOtp, 
    loginUser, 
    resendOtp,
    logoutUser,
    updateUserDetails,
    updatePassword
} from '../Controller/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/update-details/:userId', updateUserDetails);
router.post('/update-password/:userId', updatePassword);

export default router;