// src/components/UserProfile.jsx
import { useEffect, useState } from 'react';
import axiosClient from '../../../axiosClient';
import { UserIcon, MailIcon, PhoneIcon, LockIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Profile = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    useEffect(() => {
        axiosClient.get('/user')
            .then(response => {
                setUser(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Unable to load profile.');
                setLoading(false);
            });
    }, []);

    const handleChange = e => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = e => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleSubmit = e => {
        e.preventDefault();
        axiosClient.put('/user', user)
            .then(() => {
                setSuccess('Profile updated successfully.');
                setError(null);
                toast.success('Profile updated successfully!');
            })
            .catch(() => {
                setError('Error updating profile.');
                setSuccess(null);
                toast.error('Error updating profile.');
            });
    };

    const handlePasswordSubmit = e => {
        e.preventDefault();
        if (passwordData.new_password !== passwordData.new_password_confirmation) {
            toast.error('New passwords do not match!');
            return;
        }

        axiosClient.put('/user/change-password', passwordData)
            .then(() => {
                setSuccess('Password updated successfully.');
                setError(null);
                toast.success('Password updated successfully!');
                setPasswordData({
                    current_password: '',
                    new_password: '',
                    new_password_confirmation: '',
                });
                setShowPasswordForm(false);
            })
            .catch((error) => {
                const message = error.response?.data?.message || 'Error updating password.';
                setError(message);
                setSuccess(null);
                toast.error(message);
            });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-b-2 border-primary-500 rounded-full">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) return <p className="text-center mt-10 text-red-500 dark:text-red-400">{error}</p>;

    return (
        <div className="flex justify-center mt-12 px-4">
            <div className="w-full max-w-lg bg-white dark:bg-slate-700 rounded-xl shadow-md dark:shadow-lg p-6">
                <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="bg-primary-100 dark:bg-primary-900/30 p-4 rounded-xl">
                            <UserIcon className="text-primary-600 dark:text-primary-400 w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">User Profile</h2>
                            <p className="text-slate-500 dark:text-slate-400">{user.role || 'User'}</p>
                        </div>
                    </div>
                </div>

                <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div>
                        <label className="block text-slate-700 dark:text-slate-300 mb-1">Name</label>
                        <div className="flex items-center border border-slate-200 dark:border-slate-600 rounded-xl px-3 bg-white dark:bg-slate-600">
                            <UserIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2" />
                            <input
                                type="text"
                                name="name"
                                value={user.name}
                                onChange={handleChange}
                                className="w-full py-2 focus:outline-none bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-700 dark:text-slate-300 mb-1">Email</label>
                        <div className="flex items-center border border-slate-200 dark:border-slate-600 rounded-xl px-3 bg-white dark:bg-slate-600">
                            <MailIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2" />
                            <input
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                className="w-full py-2 focus:outline-none bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                        <div className="flex items-center border border-slate-200 dark:border-slate-600 rounded-xl px-3 bg-white dark:bg-slate-600">
                            <PhoneIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2" />
                            <input
                                type="text"
                                name="phone"
                                value={user.phone || ''}
                                onChange={handleChange}
                                className="w-full py-2 focus:outline-none bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="inline-flex items-center bg-primary-500 text-white px-4 py-2 rounded-xl shadow-sm hover:bg-primary-600 dark:hover:bg-primary-700"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowPasswordForm(!showPasswordForm)}
                            className="inline-flex items-center bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl shadow-sm hover:bg-slate-200 dark:hover:bg-slate-500"
                        >
                            <LockIcon className="w-4 h-4 mr-2" />
                            Change Password
                        </button>
                    </div>
                </motion.form>

                {showPasswordForm && (
                    <motion.form
                        onSubmit={handlePasswordSubmit}
                        className="mt-8 space-y-5 border-t border-slate-200 dark:border-slate-600 pt-6"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                    >
                        <div>
                            <label className="block text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                            <div className="flex items-center border border-slate-200 dark:border-slate-600 rounded-xl px-3 bg-white dark:bg-slate-600">
                                <LockIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2" />
                                <input
                                    type="password"
                                    name="current_password"
                                    value={passwordData.current_password}
                                    onChange={handlePasswordChange}
                                    className="w-full py-2 focus:outline-none bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                            <div className="flex items-center border border-slate-200 dark:border-slate-600 rounded-xl px-3 bg-white dark:bg-slate-600">
                                <LockIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2" />
                                <input
                                    type="password"
                                    name="new_password"
                                    value={passwordData.new_password}
                                    onChange={handlePasswordChange}
                                    className="w-full py-2 focus:outline-none bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                            <div className="flex items-center border border-slate-200 dark:border-slate-600 rounded-xl px-3 bg-white dark:bg-slate-600">
                                <LockIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2" />
                                <input
                                    type="password"
                                    name="new_password_confirmation"
                                    value={passwordData.new_password_confirmation}
                                    onChange={handlePasswordChange}
                                    className="w-full py-2 focus:outline-none bg-white dark:bg-slate-600 text-slate-900 dark:text-white"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center bg-primary-500 text-white px-4 py-2 rounded-xl shadow-sm hover:bg-primary-600 dark:hover:bg-primary-700"
                            >
                                Update Password
                            </button>
                        </div>
                    </motion.form>
                )}

                {success && (
                    <div className="mt-4 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-200 px-4 py-2 rounded-xl border border-primary-200 dark:border-primary-700/50 text-sm">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="mt-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 px-4 py-2 rounded-xl border border-red-200 dark:border-red-700/50 text-sm">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;

