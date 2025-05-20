import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
      fetchBlogs(token);
    }
  }, [navigate]);

  const fetchBlogs = async (token) => {
    try {
      const res = await axios.get('http://localhost:5000/blogs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlogs(res.data);
    } catch (err) {
      console.error('Failed to fetch blogs', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCreateBlog = () => {
    navigate('/create-blog');
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(blogs.filter(blog => blog._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete blog');
    }
  };

  const handleEdit = (blog) => {
    navigate('/create-blog', { state: { blog } });
  };

  const handleView = (blog) => {
    navigate('/blog-detail', { state: { blog } });
  };

  const thStyle = {
    textAlign: 'left',
    padding: '10px',
    borderBottom: '1px solid #ccc',
  };

  const tdStyle = {
    padding: '10px',
    verticalAlign: 'top',
  };

  if (!user) return null;

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px',
          borderBottom: '1px solid #ccc',
        }}
      >
        <h2>Blog</h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={handleCreateBlog} style={{ marginRight: '10px' }}>
            Create Blog
          </button>
          <button onClick={handleLogout}>Logout</button>
          {user?.profilePicture && (
            <img
              src={user.profilePicture}
              alt="Profile"
              style={{
                width: '50px',
                height: '50px',
                marginLeft: '15px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginRight: '15px',
              }}
            />
          )}
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {blogs.length === 0 ? (
          <p>No blogs found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Image</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id} style={{ borderBottom: '1px solid #ccc' }}>
                  <td style={tdStyle}>{blog.title}</td>
                  <td style={tdStyle}>{blog.description}</td>
                  <td style={tdStyle}>
                    {blog.blogImage && (
                      <img src={blog.blogImage} alt="Blog" style={{ width: '100px' }} />
                    )}
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => handleEdit(blog)} style={{ marginRight: '5px' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(blog._id)} style={{ marginRight: '5px' }}>
                      Delete
                    </button>
                    <button onClick={() => handleView(blog)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default Home;
