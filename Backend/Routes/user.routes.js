import express from 'express';
import { 
    updateUserDetails,
    updatePassword,
    getCurrentUser,
    getAllUser,
    getUserById,
    withdrawalOfCredits,
    withdrawalOfCreditsDetails
} from '../Controller/user.controller.js';
import { isAuthenticated, isAuthorized} from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.put('/update-details/:userId',isAuthenticated, updateUserDetails);
router.put('/update-password/:userId',isAuthenticated, updatePassword);
router.get('/me',isAuthenticated,getCurrentUser);
router.get('/all-user',isAuthenticated, isAuthorized("Admin"),getAllUser);
router.get('/get-user/:id', isAuthenticated, getUserById);
router.post('/withdraw-credits',isAuthenticated,withdrawalOfCredits);
router.get('/get-withdraw-details',isAuthenticated,withdrawalOfCreditsDetails);

export default router;