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
        <div className="min-h-screen bg-gray-50/50 py-6">
            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="backdrop-blur-xl bg-white/60 shadow-xl rounded-3xl p-8 border border-gray-100">
                    <header className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#274e79] to-[#1a3b5c] bg-clip-text text-transparent">
                                Edit User
                            </h2>
                            <p className="text-gray-500 mt-1">Update user information</p>
                        </div>
                        <Link 
                            to="/admin/dashboard/users" 
                            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                                       <path fillRule="evenodd" d="M10.293 2.293a1 1 0 011.414 0l8 8a1 1 0 010 1.414l-8 8a1 1 0 01-1.414-1.414L16.586 11H3a1 1 0 110-2h13.586l-6.293-6.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                   </svg>
                                               </Link>
            </header>

                    <div className="space-y-6">
                        {loading && (
                            <div className="flex items-center justify-center py-4 bg-white/80 rounded-xl backdrop-blur">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-[3px] border-current border-t-transparent text-[#274e79] transition-colors duration-200"></div>
                                <p className="ml-3 text-[#274e79] font-medium">Processing...</p>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50/50 backdrop-blur border-l-4 border-red-400 p-4 rounded-lg">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#274e79] to-[#1a3b5c] rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-200"></div>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                                        className="relative w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/70 backdrop-blur focus:bg-white focus:ring-2 focus:ring-[#274e79] focus:border-transparent transition duration-200"
                                        placeholder="Enter full name"
                    />
                </div>
                            </div>

                            <div className="relative">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#274e79] to-[#1a3b5c] rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-200"></div>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                                        className="relative w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/70 backdrop-blur focus:bg-white focus:ring-2 focus:ring-[#274e79] focus:border-transparent transition duration-200"
                                        placeholder="Enter email address"
                    />
                </div>
                </div>

                            <div className="relative">
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#274e79] to-[#1a3b5c] rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-200"></div>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                                        className="relative w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/70 backdrop-blur focus:bg-white focus:ring-2 focus:ring-[#274e79] focus:border-transparent transition duration-200"
                    >
                        <option value="">Select role</option>
                        <option value="admin">Admin</option>
                        <option value="librarian">Librarian</option>
                        <option value="user">User</option>
                    </select>
                </div>
                            </div>

                            <div className="relative">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#274e79] to-[#1a3b5c] rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-200"></div>
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="relative w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/70 backdrop-blur focus:bg-white focus:ring-2 focus:ring-[#274e79] focus:border-transparent transition duration-200"
                                        placeholder="Enter phone number"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="relative inline-flex items-center px-6 py-3 overflow-hidden text-white rounded-xl group bg-gradient-to-r from-[#274e79] to-[#1a3b5c] hover:from-[#1a3b5c] hover:to-[#274e79] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/80 border-t-transparent"></div>
                                        <span className="ml-2">Updating User...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        <span className="ml-2">Update User</span>
                                    </>
                                )}
                </button>
                        </div>
                    </div>
            </form>
            </div>
        </div>
    );
};

export default UserEditForm;

