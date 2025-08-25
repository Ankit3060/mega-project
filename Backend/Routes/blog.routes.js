import express from 'express';
import {
    createNewBlog,
    getAllBlogs,
    getCurrentUserBlogs,
    getParticularUserBlog,
    updateBlog,
    deleteBlog,
    deleteBlogByAdmin
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


export default router;