import express from 'express';
import {
    createNewBlog,
    getAllBlogs,
    getCurrentUserBlogs,
    getParticularUserBlog,
    updateBlog,
    deleteBlog,
    deleteBlogByAdmin,
    getParticularBlog
} from "../Controller/blog.controller.js"

import { isAuthenticated, isAuthorized} from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create',isAuthenticated, createNewBlog);
router.get('/all-blogs',isAuthenticated, getAllBlogs);
router.get('/my-blog',isAuthenticated, getCurrentUserBlogs);
router.get('/user-blog/:userId',isAuthenticated,getParticularUserBlog);
router.put('/update-blog/:blogId',isAuthenticated,updateBlog);
router.delete('/delete-blog/:blogId',isAuthenticated,deleteBlog);
router.delete('/admin/delete-blog/:blogId',isAuthenticated, isAuthorized("Admin") ,deleteBlogByAdmin);
router.get('/userBlog/:id', isAuthenticated, getParticularBlog);

export default router;