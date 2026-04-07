import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from "../../../axiosClient";

export default function UserAddForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const userData = {
            name,
            email,
            password,
            role,
            phone,
        };

        try {
            const response = await axiosClient.post("/register", userData);
            setError({});
            window.location.href = "/admin/dashboard/users?message=Registration successful";
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setError(error.response.data.error || {});
            } else {
                setError({ general: "An unexpected error occurred. Please try again later." });
                console.log(error);
            }
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
                                Add User
                            </h2>
                            <p className="text-gray-500 mt-1">Create a new user account</p>
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
                        
                        {error.general && (
                            <div className="bg-red-50/50 backdrop-blur border-l-4 border-red-400 p-4 rounded-lg">
                                <p className="text-red-700 text-sm">{error.general}</p>
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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                                        className="relative w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/70 backdrop-blur focus:bg-white focus:ring-2 focus:ring-[#274e79] focus:border-transparent transition duration-200"
                                        placeholder="Enter full name"
                    />
                                </div>
                                {error.name && <p className="text-red-500 text-xs mt-1">{error.name[0]}</p>}
                </div>

                            <div className="relative">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#274e79] to-[#1a3b5c] rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-200"></div>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                                        className="relative w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/70 backdrop-blur focus:bg-white focus:ring-2 focus:ring-[#274e79] focus:border-transparent transition duration-200"
                                        placeholder="Enter email address"
                    />
                                </div>
                                {error.email && <p className="text-red-500 text-xs mt-1">{error.email[0]}</p>}
                </div>

                            <div className="relative">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#274e79] to-[#1a3b5c] rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-200"></div>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                                        className="relative w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/70 backdrop-blur focus:bg-white focus:ring-2 focus:ring-[#274e79] focus:border-transparent transition duration-200"
                                        placeholder="Enter password"
                    />
                                </div>
                                {error.password && <p className="text-red-500 text-xs mt-1">{error.password[0]}</p>}
                </div>

                            <div className="relative">
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#274e79] to-[#1a3b5c] rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-200"></div>
                    <select
                        id="role"
                        name="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                                        className="relative w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/70 backdrop-blur focus:bg-white focus:ring-2 focus:ring-[#274e79] focus:border-transparent transition duration-200"
                    >
                        <option value="">Select role</option>
                        <option value="admin">Admin</option>
                        <option value="librarian">Librarian</option>
                        <option value="user">User</option>
                    </select>
                                </div>
                                {error.role && <p className="text-red-500 text-xs mt-1">{error.role[0]}</p>}
                </div>

                            <div className="relative md:col-span-2">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#274e79] to-[#1a3b5c] rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-200"></div>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                                        className="relative w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/70 backdrop-blur focus:bg-white focus:ring-2 focus:ring-[#274e79] focus:border-transparent transition duration-200"
                                        placeholder="Enter phone number"
                    />
                                </div>
                                {error.phone && <p className="text-red-500 text-xs mt-1">{error.phone[0]}</p>}
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
                                        <span className="ml-2">Adding User...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        <span className="ml-2">Add User</span>
                                    </>
                                )}
            </button>
                        </div>
                    </div>
        </form>
            </div>
        </div>
    );
}

