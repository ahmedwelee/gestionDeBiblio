import React from "react";
import styles from "../../../LibraryDashboard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGraduate, faBookOpen, faCalendarCheck, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const iconMap = {
  active_loans: <FontAwesomeIcon icon={faUserGraduate} />,
  borrowed_books: <FontAwesomeIcon icon={faBookOpen} />,
  overdue: <FontAwesomeIcon icon={faExclamationTriangle} />,
  reservation_books: <FontAwesomeIcon icon={faCalendarCheck} />,
};

export function StatCard({ icon, title, value, color = "primary", backgroundColor }) {
  const getIcon = () => iconMap[icon] || null;
  const formattedValue =
    typeof value === "number" ? value.toLocaleString() : "0";

  return (
    <div className={styles.statCard} style={{ backgroundColor }}>
      <div className={styles.statContent}>
        <div className={`${styles.iconWrapper} ${styles[`icon${color}`]}`}>
          {getIcon()}
        </div>
        <div>
          <p className={styles.statTitle}>{title}</p>
          <h3 className={styles.statValue}>{formattedValue}</h3>
        </div>
      </div>
    </div>
  );
}

