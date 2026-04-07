import React, { useState, useEffect } from "react";
import axiosClient  from "../axiosClient";
import styles from "../LibraryDashboard.module.css"; 
import { Sidebar } from "../components/admin/Sidebar";
import { StatCard } from "../components/admin/StatCard";
import { Outlet, useLocation } from "react-router";

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
            <header className="mb-8 rounded-xl bg-white px-6 py-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold leading-tight text-slate-900">
                  Admin Dashboard
                </h1>
                <p className="text-base text-slate-600">
                  Welcome back to MyLibrary
                </p>
              </div>
            </header>
            <div className={styles.statsGrid}>
              <StatCard
                icon="users"
                title="Total Users"
                value={stats.totalUsers}
                backgroundColor="#ffffff"
              />
              <StatCard
                icon="books"
                title="Total Books"
                value={stats.totalBooks}
                backgroundColor="#ffffff"
              />
              <StatCard
                icon="calendar"
                title="Active Loans"
                value={stats.activeLoans}
                backgroundColor="#ffffff"
              />
              <StatCard
                icon="totalReservations"
                title="Total Reservations"
                value={stats.totalReservations}
                backgroundColor="#ffffff"
              />
              <StatCard
                icon="alert"
                title="Overdue Books"
                value={stats.overdue}
                backgroundColor="#ffffff"
              />
              <StatCard
                icon="waitingList"
                title="WaitingList"
                value={stats.waitingList}
                backgroundColor="#ffffff"
              />
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

  return (
    <main className={styles.dashboard}>
 
      <div className={styles.contentWrapper} >
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab}  />
        <section className={styles.mainContent}>{renderContent()}</section>
      </div>
    </main>

  );
}

export default LibraryDashboard;

