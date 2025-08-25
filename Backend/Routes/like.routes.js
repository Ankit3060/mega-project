import express from 'express';
import { toggleLikeBlog } from "../Controller/likes.controller.js"

import { isAuthenticated } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/like-unlike/:blogId', isAuthenticated, toggleLikeBlog);


export default router;