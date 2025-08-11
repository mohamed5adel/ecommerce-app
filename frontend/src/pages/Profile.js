import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await api.put('/api/users/profile', formData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile</h1>
      
      <div className="card">
        <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="card mt-6">
        <h2 className="text-xl font-semibold mb-4">Account Details</h2>
        <div className="space-y-2">
          <p><span className="font-medium">User ID:</span> {user?.id}</p>
          <p><span className="font-medium">Role:</span> {user?.isAdmin ? 'Admin' : 'User'}</p>
          <p><span className="font-medium">Member since:</span> {new Date(user?.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
