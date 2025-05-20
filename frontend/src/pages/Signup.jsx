import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    profilePicture: null,
  });

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('email', formData.email);
    data.append('password', formData.password);
    if (formData.profilePicture) data.append('profilePicture', formData.profilePicture);

    try {
      const res = await axios.post('http://localhost:5000/signup', data);
      alert(res.data.message);
      setFormData({ email: '', password: '', profilePicture: null });
      navigate('/login')
    } catch (err) {
      alert(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      /><br />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      /><br />
      <label>
        Profile Picture:
        <input
          type="file"
          name="profilePicture"
          accept="image/*"
          onChange={handleChange}
        />
      </label><br />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;
