import express from 'express';
import { 
    registerUser, 
    verifyOtp, 
    loginUser, 
    resendOtp,
    logoutUser
} from '../Controller/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;