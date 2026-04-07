import React from "react";
import styles from "../../LibraryDashboard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBook, faCalendar, faExclamationTriangle, faFolderOpen } from "@fortawesome/free-solid-svg-icons";

const iconMap = {
  users: <FontAwesomeIcon icon={faUser} />,
  books: <FontAwesomeIcon icon={faBook} />,
  calendar: <FontAwesomeIcon icon={faCalendar} />,
  alert: <FontAwesomeIcon icon={faExclamationTriangle} />,
  totalReservations: <FontAwesomeIcon icon={faFolderOpen} />,
  waitingList: <FontAwesomeIcon icon={faFolderOpen} />,
};

export function StatCard({ icon, title, value, color = "primary", backgroundColor }) {
  const getIcon = () => iconMap[icon] || null;

  const formattedValue =
    typeof value === "number" ? value.toLocaleString() : "0";

  return (
    <div style={{ backgroundColor }} className={styles.statCard}>
      <div className={styles.statContent}>
        <div className={`${styles.iconWrapper} ${styles[`icon${color}`]}`}>
          {getIcon()}
        </div>
        <div>
          <p className={styles.statTitle} style={{ fontSize: '16px', fontWeight: 'bold' }}>{title}</p>
          <h3 className={styles.statValue} style={{ fontSize: '28px', fontWeight: '700' }}>{formattedValue}</h3>
        </div>
      </div>
    </div>
  );
}

