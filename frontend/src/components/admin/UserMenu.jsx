"use client";
import React, { useState, useEffect } from "react";
import axiosClient from "../../axiosClient";
import { useNavigate } from "react-router-dom";
import { logout as logoutService } from '../../services/AuthService';
import styles from "../../LibraryDashboard.module.css";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axiosClient.get("/user").then((response) => {
      const { role } = response.data;
      if (role === "user") {
        navigate("/");
      } else {
        setUser(response.data);
      }
    });
  }, [navigate]);

  const logout = async () => {
    try {
      await logoutService();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-3 p-2 bg-white dark:bg-midnight-card rounded-lg hover:bg-slate-50 dark:hover:bg-midnight-border transition-colors duration-200 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="text-left">
          <div className="font-medium text-slate-900 dark:text-slate-200 transition-colors duration-500">{user.name}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-500">{user.email}</div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-midnight-card shadow-lg dark:shadow-glass-lg rounded-lg overflow-hidden z-20 border border-slate-200 dark:border-midnight-border transition-all duration-200">
          <button
            className="flex items-center justify-between w-full p-3 hover:bg-slate-50 dark:hover:bg-midnight-border focus:outline-none text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors duration-200"
            onClick={logout}
          >
            <span className="font-medium">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}


