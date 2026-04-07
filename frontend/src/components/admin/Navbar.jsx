"use client";
import React, { useState } from "react";
import { Link } from 'react-router-dom';
import styles from "../../LibraryDashboard.module.css";
import { UserMenu } from "./UserMenu";

export function Navbar() {
  const [notifications, setNotifications] = useState(3);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <Link to="/">
          <div className={styles.logo}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#274e79"
              strokeWidth="2"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span>LibraryOS</span>
          </div>
        </Link>
      </div>

      <div className={styles.navbarRight}>
  
        <UserMenu />
      </div>
    </nav>
  );
}

