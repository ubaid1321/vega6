import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BlogDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const blog = location.state?.blog;

  if (!blog) {
    return (
      <div style={{ padding: '20px' }}>
        <p>No blog data available.</p>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate('/')} style={{ marginBottom: '20px' }}>
        ← Back to Home
      </button>

      <h1>{blog.title}</h1>
      <p style={{ marginBottom: '20px' }}>{blog.description}</p>

      {blog.blogImage && (
        <img
          src={blog.blogImage}
          alt="Blog"
          style={{
            width: '100%',
            maxHeight: '400px',
            objectFit: 'cover',
            marginBottom: '20px',
          }}
        />
      )}

      {/* Add full content if available */}
      {blog.content && (
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
          {blog.content}
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
