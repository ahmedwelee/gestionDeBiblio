import React, { useState, useEffect } from "react";
import axiosClient  from "../axiosClient";
import styles from "../LibraryDashboard.module.css"; 
import { Sidebar } from "../components/admin/Sidebar";
import { StatCard } from "../components/admin/StatCard";
import { Outlet, useLocation } from "react-router";
import { useTheme } from "../context/ThemeContext";

const initialStats = {
  totalUsers: 0,
  totalBooks: 0,
  activeLoans: 0,
  overdue: 0,
  totalReservations: 0,
  waitingList: 0,
};

export function LibraryDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(initialStats);
  const [isEditing, setIsEditing] = useState(false); // New state for edit mode
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const handleEdit = () => {
    setIsEditing(true); // Enable edit mode
  };
  const handleCancelEdit = () => {
    setIsEditing(false); // Disable edit mode
  };

  const renderContent = () => {
    switch (location.pathname) {
      case "/admin/dashboard":
        return (
          <>
            <div className="mb-8">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-700 dark:to-indigo-800 rounded-xl px-8 py-8 shadow-lg text-white">
                <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-indigo-50">Welcome back to MyLibrary Management</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Users</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-2">{stats.totalUsers}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700/50 rounded-lg p-4">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Books</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">{stats.totalBooks}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700/50 rounded-lg p-4">
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Active Loans</p>
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300 mt-2">{stats.activeLoans}</p>
              </div>
              <div className="bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-700/50 rounded-lg p-4">
                <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">Total Reservations</p>
                <p className="text-3xl font-bold text-cyan-700 dark:text-cyan-300 mt-2">{stats.totalReservations}</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 rounded-lg p-4">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Overdue Books</p>
                <p className="text-3xl font-bold text-red-700 dark:text-red-300 mt-2">{stats.overdue}</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700/50 rounded-lg p-4">
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Waiting List</p>
                <p className="text-3xl font-bold text-orange-700 dark:text-orange-300 mt-2">{stats.waitingList}</p>
              </div>
            </div>
          </>
        );
      default:
        return <Outlet />;
    }
  };

  useEffect(() => {
    const currentTab = location.pathname.split("/").pop();
    setActiveTab(currentTab);
  }, [location]);

  useEffect(() => {
    axiosClient.get("/stats").then((response) => {
      setStats(response.data);
    });
  }, []);

  const dashboardStyle = {
    background: isDarkMode 
      ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
      : '#f8fafc',
    transition: 'background 0.3s ease'
  };

  return (
    <main className={`${styles.dashboard} ${isDarkMode ? 'dark' : ''}`} style={dashboardStyle}>
      <div className={styles.contentWrapper}>
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <section className={styles.mainContent}>{renderContent()}</section>
      </div>
    </main>

  );
}

export default LibraryDashboard;

