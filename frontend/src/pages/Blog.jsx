import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Blog = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const isEditing = !!state?.blog;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    blogImage: null,
  });

  useEffect(() => {
    if (isEditing) {
      setFormData({
        title: state.blog.title,
        description: state.blog.description,
        blogImage: null,
      });
    }
  }, [state, isEditing]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');

  if (!token) {
    alert('User not logged in');
    navigate('/login');
    return;
  }

  const data = new FormData();
  data.append('title', formData.title);
  data.append('description', formData.description);
  if (formData.blogImage) {
    data.append('blogImage', formData.blogImage);
  }

  try {
    if (isEditing) {
      await axios.put(`http://localhost:5000/blogs/${state.blog._id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Blog updated!');
    } else {
      await axios.post('http://localhost:5000/blogs', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Blog created!');
    }
    navigate('/');
  } catch (err) {
    console.error('Error response:', err.response);
    if (err.response) {
      alert(`Operation failed: ${err.response.data.error || err.response.statusText}`);
    } else if (err.request) {
      alert('Operation failed: No response from server.');
    } else {
      alert(`Operation failed: ${err.message}`);
    }
  }
};

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
      <h2>{isEditing ? 'Edit Blog' : 'Create Blog'}</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <br /><br />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <br /><br />
      <input
        type="file"
        name="blogImage"
        accept="image/*"
        onChange={handleChange}
      />
      <br /><br />
      <button type="submit">{isEditing ? 'Update' : 'Create'} Blog</button>
    </form>
  );
};

export default Blog;
