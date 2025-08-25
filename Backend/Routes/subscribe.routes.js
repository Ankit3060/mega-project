import express from 'express';
import { subscription, followerCount,followingCount, removeFollower} from "../Controller/subscribe.controller.js"

import { isAuthenticated } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/follow-unfollow/:bloggerId',isAuthenticated, subscription);
router.get('/follower/:bloggerId',isAuthenticated, followerCount);
router.get('/following/:userId',isAuthenticated, followingCount);
router.delete('/remove-follower/:followerId',isAuthenticated, removeFollower);


export default router;