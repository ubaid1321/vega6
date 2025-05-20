import express from 'express';
import { createBlog, getBlogs, updateBlog, deleteBlog } from '../controllers/blogController.js';
import authMiddleware from '../middleware/authMiddleware.js'; 
import uploadBlogImage from '../middleware/uploadBlogImage.js';
const router = express.Router();


router.get('/', authMiddleware, getBlogs);
router.post('/', authMiddleware, uploadBlogImage.single('blogImage'), createBlog);
router.put('/:id', authMiddleware, uploadBlogImage.single('blogImage'), updateBlog);
router.delete('/:id', authMiddleware, deleteBlog);

export default router;
