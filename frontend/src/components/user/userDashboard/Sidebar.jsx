import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../LibraryDashboard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "../../../context/ThemeContext";
import {
  faHome,
  faCalendar,
  faHistory,
  faBook,
  faBookmark,
  faUser,
  faClock
} from "@fortawesome/free-solid-svg-icons";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: faHome, to: "/dashboard" },
  { id: "reservations", label: "Reservations", icon: faCalendar, to: "/dashboard/reservations" },
  { id: "history", label: "History", icon: faHistory, to: "/dashboard/history" },
  { id: "borrowing", label: "Borrowing", icon: faBook, to: "/dashboard/borrowing" },
  { id: "overdue-books", label: "Overdue Books", icon: faBookmark, to: "/dashboard/overdue-books" },
  { id: "waitingList", label: "Waiting List", icon: faClock, to: "/dashboard/waitingList" },
  { id: "profile", label: "Profile", icon: faUser, to: "/dashboard/profile" },
];

export function Sidebar({ activeTab, onTabChange }) {
  const { isDarkMode } = useTheme();

  const sidebarStyle = {
    background: isDarkMode ? '#1e293b' : '#ffffff',
    transition: 'background 0.3s ease'
  };

  return (
    <aside className={styles.sidebar} style={sidebarStyle}>
      {navItems.map((item) => (
        <Link
          key={item.id}
          to={item.to}
          className={`${styles.navItem} ${activeTab === item.id ? styles.navItemActive : ""}`}
          onClick={() => onTabChange(item.id)}
        >
          <FontAwesomeIcon icon={item.icon} />
          <span>{item.label}</span>
        </Link>
      ))}
    </aside>
  );
}

