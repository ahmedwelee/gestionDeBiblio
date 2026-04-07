import React from "react";
import { Link } from "react-router-dom";
import styles from "../../LibraryDashboard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faBook,
  faPencil,
  faFolder,
  faCalendar,
  faFile,
  faUserPlus,
  faClock
} from "@fortawesome/free-solid-svg-icons";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: faHome, to: "/admin/dashboard" },
  { id: "users", label: "Users", icon: faUser, to: "/admin/dashboard/users" },
  { id: "books", label: "Books", icon: faBook, to: "/admin/dashboard/books" },
  { id: "authors", label: "Authors", icon: faPencil, to: "/admin/dashboard/authors" },
  { id: "categories", label: "Categories", icon: faFolder, to: "/admin/dashboard/categories" },
  { id: "reservations", label: "Reservations", icon: faCalendar, to: "/admin/dashboard/reservations" },
  { id: "borrow-records", label: "Borrow Records", icon: faFile, to: "/admin/dashboard/borrow-records" },
  { id: "register-request", label: "Register Requests", icon: faUserPlus, to: "/admin/dashboard/register-request" },
  { id: "waitingList", label: "Waiting List", icon: faClock, to: "/admin/dashboard/waitingList" },
];

export function Sidebar({ activeTab, onTabChange }) {
  return (
    <aside className={styles.sidebar}>
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

