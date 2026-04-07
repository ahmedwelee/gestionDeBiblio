import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOff, faToggleOn, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from "../../../LibraryDashboard.module.css";

function UserTableRow({ index, user, onToggle }) {
  const navigate = useNavigate();
  const isActive = user.is_active === 1;

  return (
    <tr className={`${styles.tableRow} transition-all duration-200`}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200 transition-colors duration-500">{index + 1}</td>
      <td className="text-sm text-slate-900 dark:text-slate-300 font-light px-6 py-4 whitespace-nowrap transition-colors duration-500">{user.name}</td>
      <td className="text-sm text-slate-900 dark:text-slate-300 font-light px-6 py-4 whitespace-nowrap transition-colors duration-500">{user.email}</td>
      <td className="text-sm text-slate-900 dark:text-slate-300 font-light px-6 py-4 whitespace-nowrap transition-colors duration-500">{user.phone}</td>
      <td className="text-sm text-slate-900 dark:text-slate-300 font-light px-6 py-4 whitespace-nowrap transition-colors duration-500">{user.role}</td>
      <td className="text-sm font-medium px-6 py-4 whitespace-nowrap">
        <div className={styles.actionButtons}>
          <button
            onClick={() => onToggle(user.id, !isActive)}
            className={`${styles.actionButton} ${isActive ? styles.activeButton : styles.inactiveButton}`}
            title={isActive ? "Deactivate user" : "Activate user"}
          >
            <FontAwesomeIcon icon={isActive ? faToggleOn : faToggleOff} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get("message");
    if (message) {
      setSuccessMessage(message);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`/users`)
      .then((response) => {
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = users.filter(({ name, email, phone, role }) =>
      (name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (role || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

const handleToggle = (userId, isActive) => {
  axiosClient
    .put(`/user/toggle/${userId}`, { active: isActive ? 1 : 0 })
    .then(() => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, is_active: isActive ? 1 : 0 } // update is_active immediately
            : user
        )
      );
      setSuccessMessage(`User ${isActive ? "activated" : "deactivated"} successfully.`);
    })
    .catch((error) => {
      console.error("Error toggling user:", error);
      alert("Failed to toggle user.");
    });
};

  const paginatedUsers = filteredUsers.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filteredUsers.length / perPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="spinner-border animate-spin inline-block w-8 h-8 border-b-2 border-blue-500 rounded-full"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      {successMessage && (
        <div className="mb-4 p-4 rounded-lg bg-green-50 border-l-4 border-green-400">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#274e79] to-[#1a3b5c] bg-clip-text text-transparent">
          Users List
        </h2>
        <Link
          to="/admin/dashboard/users/add"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#274e79] to-[#1a3b5c] text-white rounded-xl hover:from-[#1a3b5c] hover:to-[#274e79] transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add User
        </Link>
      </div>

      <div className={styles.tableControls}>
        <div className="relative">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className={`${styles.searchInput} pl-10`}
            placeholder="Search users..."
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Show</span>
          <select
            value={perPage}
            onChange={(e) => setPerPage(parseInt(e.target.value))}
              className={styles.pageButton}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
          
          <div className={styles.pageControls}>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
              className={styles.pageButton}
          >
            Previous
          </button>
            <span className="text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
              className={styles.pageButton}
          >
            Next
          </button>
        </div>
      </div>
      </div>

      <div className="overflow-x-auto rounded-xl">
        <table className={styles.table}>
          <thead className="bg-gradient-to-r from-[#274e79] to-[#1a3b5c] text-white">
            <tr>
              <th scope="col" className="px-6 py-4 border-r border-white/10 font-semibold text-sm uppercase">#</th>
              <th scope="col" className="px-6 py-4 border-r border-white/10 font-semibold text-sm uppercase">Name</th>
              <th scope="col" className="px-6 py-4 border-r border-white/10 font-semibold text-sm uppercase">Email</th>
              <th scope="col" className="px-6 py-4 border-r border-white/10 font-semibold text-sm uppercase">Phone</th>
              <th scope="col" className="px-6 py-4 border-r border-white/10 font-semibold text-sm uppercase">Role</th>
              <th scope="col" className="px-6 py-4 font-semibold text-sm uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedUsers.map((user, index) => (
              <UserTableRow
                key={user.id}
                index={(page - 1) * perPage + index}
                user={user}
                onToggle={handleToggle}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

