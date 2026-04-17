import React, { useState, useEffect } from 'react';
import axiosClient from "../../../axiosClient";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "../../../LibraryDashboard.module.css";

const UserEditForm = ({ onSubmit }) => {
    const { userId } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const response = await axiosClient.get(`/users/${userId}`);
                setFormData({
                    name: response.data.name,
                    email: response.data.email,
                    role: response.data.role,
                    phone: response.data.phone,
                });
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setError('User not found');
                } else {
                    console.error('Failed to fetch user data:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosClient.put(`/users/${userId}`, formData);
            if (onSubmit) {
                onSubmit(response.data);
            }
            navigate(`/admin/dashboard/users?message=User updated successfully`);
        } catch (error) {
            console.error('Failed to update user data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Edit User</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Update user information</p>
                </div>
                <Link 
                    to="/admin/dashboard/users" 
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-medium transition-colors duration-200"
                >
                    ← Back
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8">

                {loading && (
                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Processing...</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg">
                        <p className="text-red-700 dark:text-red-200 text-sm font-medium">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter full name"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter email address"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">Role</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                            <option value="">Select role</option>
                            <option value="admin">Admin</option>
                            <option value="librarian">Librarian</option>
                            <option value="user">User</option>
                        </select>
                    </div>

                    {/* Phone */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">Phone Number</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter phone number"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Link
                        to="/admin/dashboard/users"
                        className="px-6 py-2.5 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold transition-all duration-200 hover:shadow-md"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-2.5 bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-green-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block mr-2"></div>
                                Updating...
                            </>
                        ) : (
                            'Update User'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserEditForm;

