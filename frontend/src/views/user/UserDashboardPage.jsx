import { useState, useEffect } from "react";
import styles from "../../LibraryDashboard.module.css";
import { Sidebar } from "../../components/user/userDashboard/Sidebar";
import { StatCard } from "../../components/user/userDashboard/StatCard";
import { Outlet, useLocation, Link } from "react-router";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import axiosClient from "../../axiosClient";

const initialStats = {
  active_loans: 0,
  borrowed_books: 0,
  overdue: 0,
  reservation_books: 0,
};

function LoginPrompt() {
  return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-midnight-950 dark:to-slate-900 p-6 transition-colors duration-500">
        <div className="text-center p-10 bg-white dark:bg-midnight-card rounded-xl shadow-md dark:shadow-glass-lg max-w-md w-full border border-slate-200 dark:border-midnight-border/30 transition-all duration-500">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-midnight-text mb-4 transition-colors duration-500">Authentication Required</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 transition-colors duration-500">You must have an account to access the dashboard.</p>
          <div className="space-y-4">
            <Link
                to="/login"
                className="block w-full py-3 px-6 text-white bg-primary-500 hover:bg-primary-600 rounded-xl font-semibold transition-all duration-300"
            >
              Login to Your Account
            </Link>
            <Link
                to="/registerrequest"
                className="block w-full py-3 px-6 text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-500/30 hover:bg-primary-100 dark:hover:bg-primary-950/50 rounded-xl font-semibold transition-all duration-300"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
  );
}

export function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(initialStats);
  const location = useLocation();
  const { user } = useUser();
  const { isDarkMode } = useTheme();

  // Hooks toujours au top level
  useEffect(() => {
    if (!user) return;
    axiosClient
        .get("user/stats")
        .then((response) => {
          setStats({
            active_loans: response.data.active_loans,
            borrowed_books: response.data.borrowed_books,
            overdue: response.data.overdue,
            reservation_books: response.data.reservation_books,
          });
        })
        .catch((error) => console.log(error));
  }, [user]);

  useEffect(() => {
    const currentTab = location.pathname.split("/").pop();
    setActiveTab(currentTab);
  }, [location]);

  const renderContent = () => {
    switch (location.pathname) {
      case "/dashboard":
        return (
            <>
              <div className="mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-xl px-8 py-8 shadow-lg text-white">
                  <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
                  <p className="text-blue-50">Here's your library activity overview</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700/50 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Active Loans</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">{stats.active_loans}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Borrowed</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-2">{stats.borrowed_books}</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 rounded-lg p-4">
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">Overdue Books</p>
                  <p className="text-3xl font-bold text-red-700 dark:text-red-300 mt-2">{stats.overdue}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700/50 rounded-lg p-4">
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Reservations</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300 mt-2">{stats.reservation_books}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <a href="/dashboard/borrowing" className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg text-center transition-colors">
                    <p className="text-2xl mb-1">📚</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">My Books</p>
                  </a>
                  <a href="/dashboard/reservations" className="p-4 bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-700/50 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 rounded-lg text-center transition-colors">
                    <p className="text-2xl mb-1">🔖</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Reservations</p>
                  </a>
                  <a href="/dashboard/overdue-books" className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg text-center transition-colors">
                    <p className="text-2xl mb-1">⏰</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Overdue</p>
                  </a>
                  <a href="/dashboard/history" className="p-4 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700/50 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg text-center transition-colors">
                    <p className="text-2xl mb-1">📖</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">History</p>
                  </a>
                </div>
              </div>
            </>
        );
      default:
        return <Outlet />;
    }
  };

  // Render conditionnel seulement ici
  if (!user) return <LoginPrompt />;

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

export default UserDashboardPage;
