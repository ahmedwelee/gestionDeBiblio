import { useState, useEffect } from "react";
import styles from "../../LibraryDashboard.module.css";
import { Sidebar } from "../../components/user/userDashboard/Sidebar";
import { StatCard } from "../../components/user/userDashboard/StatCard";
import { Outlet, useLocation, Link } from "react-router";
import { useUser } from "../../context/UserContext";
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
              <header className="mb-8 rounded-xl bg-white dark:bg-midnight-card px-6 py-6 shadow-sm dark:shadow-glass-md border border-slate-200 dark:border-midnight-border/30 transition-all duration-500">
                <div>
                  <h1 className="text-3xl font-semibold text-slate-900 dark:text-midnight-text transition-colors duration-500">User Dashboard</h1>
                  <p className="text-base text-slate-600 dark:text-slate-400 transition-colors duration-500">Hello again, welcome to MyLibrary</p>
                </div>
              </header>
              <div className={styles.statsGrid}>
                <StatCard icon="active_loans" title="Active Loans" value={stats.active_loans} color="primary" backgroundColor="#ffffff"/>
                <StatCard icon="borrowed_books" title="Borrowed Books" value={stats.borrowed_books} color="primary" backgroundColor="#ffffff"/>
                <StatCard icon="overdue" title="Overdue Books" value={stats.overdue} color="danger" backgroundColor="#ffffff"/>
                <StatCard icon="reservation_books" title="Reservation Books" value={stats.reservation_books} color="primary" backgroundColor="#ffffff"/>
              </div>
            </>
        );
      default:
        return <Outlet />;
    }
  };

  // Render conditionnel seulement ici
  if (!user) return <LoginPrompt />;

  return (
      <main className={styles.dashboard}>
        <div className={styles.contentWrapper}>
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <section className={styles.mainContent}>{renderContent()}</section>
        </div>
      </main>
  );
}

export default UserDashboardPage;
