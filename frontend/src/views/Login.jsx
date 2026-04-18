"use client";
import React, { useState } from "react";
import styles from "../login.module.css";
import { login } from "../services/AuthService";
import { useUser } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../axiosClient";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setGeneralError(null);

    try {
      await login(form);
      const { data } = await axiosClient.get("/user");
      setUser(data);

      // Check user role first
      if (data.role === "admin") {
        localStorage.removeItem('returnTo'); // Clean up any saved return URL
        navigate("/admin/dashboard");
      } else {
        // For regular users, handle the return URL logic
        const returnTo = localStorage.getItem('returnTo');
        if (returnTo) {
          localStorage.removeItem('returnTo');
          navigate(returnTo);
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;

        if (status === 422 && data.errors) {
          setErrors(data.errors);
        } else if ((status === 401 || status === 403) && data.message) {
          setGeneralError(data.message);
        } else {
          setGeneralError("Login failed. Please try again.");
        }
      } else {
        setGeneralError("Network error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`${styles.loginPage} min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white dark:from-midnight-950 dark:to-slate-900 p-6 transition-colors duration-500`}>
      <div className={`${styles.loginContainer} bg-white dark:bg-midnight-card w-full max-w-md rounded-2xl shadow-lg dark:shadow-glass-lg p-8 md:p-10 space-y-6 border border-slate-200 dark:border-midnight-border/30 transition-all duration-500`}>
        <header className="text-center space-y-3 mb-8">
          <img
            src="https://static.vecteezy.com/system/resources/previews/013/579/783/large_2x/doing-his-research-in-library-concentrated-young-man-reading-book-while-sitting-against-bookshelf-free-photo.JPG"
            alt="Library Management System"
            className="w-32 h-32 mx-auto rounded-full object-cover shadow-md border-4 border-white dark:border-midnight-card"
          />
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-midnight-text transition-colors duration-500">Welcome Back!</h1>
          <p className="text-slate-600 dark:text-slate-400 text-base transition-colors duration-500">Sign in to explore our digital library collection</p>
        </header>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* General error */}
          {generalError && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/30 p-4 text-red-700 dark:text-red-400 transition-all duration-500"
            >
              {generalError}
            </div>
          )}

          {/* Email field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-500">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter your email"
              className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-midnight-950 text-slate-900 dark:text-midnight-text placeholder-slate-400 dark:placeholder-slate-500 ${
                errors.email ? 'border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30' : 'border-slate-200 dark:border-midnight-border focus:ring-primary-100 dark:focus:ring-primary-900/30'
              } focus:border-primary-400 dark:focus:border-primary-500 focus:outline-none focus:ring-4 transition duration-200`}
            />
            {errors.email && (
              <p className="text-sm text-red-600 dark:text-red-400 transition-colors duration-500">{errors.email[0]}</p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-500">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-midnight-950 text-slate-900 dark:text-midnight-text placeholder-slate-400 dark:placeholder-slate-500 ${
                errors.password ? 'border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30' : 'border-slate-200 dark:border-midnight-border focus:ring-primary-100 dark:focus:ring-primary-900/30'
              } focus:border-primary-400 dark:focus:border-primary-500 focus:outline-none focus:ring-4 transition duration-200`}
            />
            {errors.password && (
              <p className="text-sm text-red-600 dark:text-red-400 transition-colors duration-500">{errors.password[0]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <footer className="flex items-center justify-center space-x-2 text-sm">
            <span className="text-slate-600 dark:text-slate-400 transition-colors duration-500">Need library access?</span>
            <Link to="/registerrequest" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition duration-200">
              Contact administrator
            </Link>
          </footer>
        </form>
      </div>
    </main>
  );
}

export default Login;
