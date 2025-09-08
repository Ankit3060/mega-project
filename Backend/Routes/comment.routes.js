import express from 'express';
import { newComment, 
        editComment, 
        deleteComment, 
        getBlogComment,
    deleteCommentByAdmin,
    deleteCommentByBlogOwner
} from "../Controller/comment.controller.js"

import { isAuthenticated, isAuthorized } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-comment/:blogId',isAuthenticated, newComment);
router.patch('/update-comment/:commentId',isAuthenticated, editComment);
router.delete('/delete-comment/:commentId',isAuthenticated, deleteComment);
router.delete('/admin/delete-comment/:commentId',isAuthenticated, isAuthorized("Admin") ,deleteCommentByAdmin);
router.get('/getBlog-comment/:blogId',isAuthenticated, getBlogComment);
router.delete('/blogOwner/delete-comment/:commentId',isAuthenticated, deleteCommentByBlogOwner);


export default router;