"use client";
import React, { useState } from "react";
import styles from "../login.module.css";
import axiosClient from "../axiosClient";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function RegisterRequest() {
    const [name, setName] = useState('');
    const [gmail, setGmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const handleRegisterRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await axiosClient.post("/register/request", { name, gmail, phone });
            setName('');
            setGmail('');
            setPhone('');
            setLoading(false);
            setMessage('Request sent successfully. We will contact you soon.');
        } catch (err) {
            setLoading(false);
            setErrors(err.response.data.errors);
        }
    };

    return (
        <main className={`${styles.loginPage} min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white dark:from-midnight-950 dark:to-slate-900 p-6 transition-colors duration-500`}>
            <div className={`${styles.loginContainer} bg-white dark:bg-midnight-card w-full max-w-md rounded-2xl shadow-lg dark:shadow-glass-lg p-8 md:p-10 space-y-6 border border-slate-200 dark:border-midnight-border/30 transition-all duration-500`}>
                <header className="text-center space-y-3 mb-8">
                    <img
                        src="https://images.pexels.com/photos/16420235/pexels-photo-16420235.jpeg"
                        alt="Library Management System"
                        className="w-32 h-32 mx-auto rounded-full object-cover shadow-md border-4 border-white dark:border-midnight-card"
                    />
                    <h1 className="text-3xl font-semibold text-slate-900 dark:text-midnight-text transition-colors duration-500">Join Our Library Community</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-base transition-colors duration-500">Submit your details and start your reading journey with us</p>
                </header>

                <form onSubmit={handleRegisterRequest} className="space-y-6">
                    {message && (
                        <div className="rounded-xl bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-500/30 p-4 text-primary-700 dark:text-primary-400 transition-all duration-500">
                            {message}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-500">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-midnight-950 text-slate-900 dark:text-midnight-text placeholder-slate-400 dark:placeholder-slate-500 ${
                                errors.name ? 'border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30' : 'border-slate-200 dark:border-midnight-border focus:ring-primary-100 dark:focus:ring-primary-900/30'
                            } focus:border-primary-400 dark:focus:border-primary-500 focus:outline-none focus:ring-4 transition duration-200`}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600 dark:text-red-400 transition-colors duration-500">{errors.name[0]}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-500">Gmail</label>
                        <input
                            type="email"
                            value={gmail}
                            onChange={(e) => setGmail(e.target.value)}
                            placeholder="Enter your gmail"
                            className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-midnight-950 text-slate-900 dark:text-midnight-text placeholder-slate-400 dark:placeholder-slate-500 ${
                                errors.gmail ? 'border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30' : 'border-slate-200 dark:border-midnight-border focus:ring-primary-100 dark:focus:ring-primary-900/30'
                            } focus:border-primary-400 dark:focus:border-primary-500 focus:outline-none focus:ring-4 transition duration-200`}
                        />
                        {errors.gmail && (
                            <p className="text-sm text-red-600 dark:text-red-400 transition-colors duration-500">{errors.gmail[0]}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-500">Phone</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="e.g. +212612345678 or 0612345678"
                            pattern="^(\+212|0)([ \-]?[0-9]{3,4}){3}$"
                            maxLength={15}
                            required
                            className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-midnight-950 text-slate-900 dark:text-midnight-text placeholder-slate-400 dark:placeholder-slate-500 ${
                                errors.phone ? 'border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30' : 'border-slate-200 dark:border-midnight-border focus:ring-primary-100 dark:focus:ring-primary-900/30'
                            } focus:border-primary-400 dark:focus:border-primary-500 focus:outline-none focus:ring-4 transition duration-200`}
                        />
                        <small className="block text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-500">
                            Format: +212XXXXXXXXX or 0XXXXXXXXX
                        </small>
                        {errors.phone && (
                            <p className="text-sm text-red-600 dark:text-red-400 transition-colors duration-500">{errors.phone[0]}</p>
                        )}
                    </div>

                    <div className="space-y-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className={styles.submitButton}
                        >
                            {loading ? 'Sending...' : 'Send Request'}
                        </button>

                        <Link
                            to="/login"
                            className="flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors duration-200"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                            <span>Back to Login</span>
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default RegisterRequest;

