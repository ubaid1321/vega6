import Blog from '../models/blogModel.js';

export const createBlog = async (req, res) => {
  try {
    const { title, description } = req.body;
    const blogImage = req.file ? req.file.path : null;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User ID missing' });
    }

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const blog = new Blog({ title, description, blogImage, user: userId });
    await blog.save();

    res.status(201).json(blog);
  } catch (err) {
    console.error('Create blog error:', err);
    res.status(500).json({ error: 'Failed to create blog', details: err.message });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User ID missing' });
    }

    const blogs = await Blog.find({ user: userId }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error('Get blogs error:', err);
    res.status(500).json({ error: 'Failed to fetch blogs', details: err.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { title, description } = req.body;
    const blogImage = req.file ? req.file.path : undefined;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User ID missing' });
    }

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const updateData = { title, description };
    if (blogImage) updateData.blogImage = blogImage;

    const blog = await Blog.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      updateData,
      { new: true }
    );

    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    console.error('Update blog error:', err);
    res.status(500).json({ error: 'Failed to update blog', details: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User ID missing' });
    }

    const blog = await Blog.findOneAndDelete({ _id: req.params.id, user: userId });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    console.error('Delete blog error:', err);
    res.status(500).json({ error: 'Failed to delete blog', details: err.message });
  }
};
