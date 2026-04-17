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
        <div className="w-full">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Add New User</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Create a new user account</p>
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
                
                {error.general && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg">
                        <p className="text-red-700 dark:text-red-200 text-sm font-medium">{error.general}</p>
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
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter full name"
                        />
                        {error.name && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error.name[0]}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter email address"
                        />
                        {error.email && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error.email[0]}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter password"
                        />
                        {error.password && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error.password[0]}</p>}
                    </div>

                    {/* Role */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">Role</label>
                        <select
                            id="role"
                            name="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                            <option value="">Select role</option>
                            <option value="admin">Admin</option>
                            <option value="librarian">Librarian</option>
                            <option value="user">User</option>
                        </select>
                        {error.role && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error.role[0]}</p>}
                    </div>

                    {/* Phone */}
                    <div className="md:col-span-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">Phone Number</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter phone number"
                        />
                        {error.phone && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error.phone[0]}</p>}
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
                                Adding...
                            </>
                        ) : (
                            'Add User'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

