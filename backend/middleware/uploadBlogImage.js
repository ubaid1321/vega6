import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const blogStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'blog_images',  
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const uploadBlogImage = multer({ storage: blogStorage });

export default uploadBlogImage;
