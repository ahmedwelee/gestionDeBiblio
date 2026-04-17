import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOff, faToggleOn, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from "../../../LibraryDashboard.module.css";
import adminStyles from "../Admin.module.css";

function UserTableRow({ index, user, onToggle }) {
  const navigate = useNavigate();
  const isActive = user.is_active === 1;

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-500/20 text-red-600 dark:text-red-400';
      case 'librarian':
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
      case 'user':
      case 'member':
        return 'bg-green-500/20 text-green-600 dark:text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="group flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
      <div className="flex-1 min-w-0 grid grid-cols-5 gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
        </div>
        <div className="hidden sm:block">
          <p className="text-sm text-slate-600 dark:text-slate-300">{user.email}</p>
        </div>
        <div className="hidden md:block">
          <p className="text-sm text-slate-600 dark:text-slate-300">{user.phone}</p>
        </div>
        <div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
            {user.role}
          </span>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => onToggle(user.id, !isActive)}
            className={`group relative inline-flex h-9 w-16 items-center rounded-full transition-all duration-300 shadow-sm hover:shadow-md ${
              isActive 
                ? 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700' 
                : 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'
            }`}
            title={isActive ? "Click to deactivate" : "Click to activate"}
          >
            <span
              className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-md transition-all duration-300 ${
                isActive ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
            <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className={`text-xs font-bold transition-opacity duration-300 ${
                isActive 
                  ? 'opacity-0' 
                  : 'opacity-100 text-white'
              }`}>
                OFF
              </span>
              <span className={`absolute text-xs font-bold transition-opacity duration-300 ${
                isActive 
                  ? 'opacity-100 text-white' 
                  : 'opacity-0'
              }`}>
                ON
              </span>
            </span>
          </button>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            isActive
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
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
    <div className="w-full">
      {/* Success Alert */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-lg flex items-center gap-3 animate-in fade-in duration-300">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm font-medium text-green-700 dark:text-green-200">{successMessage}</p>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Users</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Manage system users and permissions</p>
          </div>
          <Link
            to="/admin/dashboard/users/add"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add User
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3.5 text-slate-400 dark:text-slate-500 text-sm" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Search users..."
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Per page:</span>
          <select
            value={perPage}
            onChange={(e) => setPerPage(parseInt(e.target.value))}
            className="px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Column Headers */}
        <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 font-semibold text-sm text-slate-700 dark:text-slate-300">
          <div>Name & Email</div>
          <div className="hidden sm:block">Email</div>
          <div className="hidden md:block">Phone</div>
          <div>Role</div>
          <div className="text-right">Status</div>
        </div>

        {/* Rows */}
        <div>
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user) => (
              <UserTableRow
                key={user.id}
                index={users.indexOf(user)}
                user={user}
                onToggle={handleToggle}
              />
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM16 12H8" />
              </svg>
              <p className="text-slate-600 dark:text-slate-400 font-medium">No users found</p>
              <p className="text-slate-500 dark:text-slate-500 text-sm">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Showing <span className="font-semibold text-slate-900 dark:text-white">{Math.min((page - 1) * perPage + 1, filteredUsers.length)}</span> to <span className="font-semibold text-slate-900 dark:text-white">{Math.min(page * perPage, filteredUsers.length)}</span> of <span className="font-semibold text-slate-900 dark:text-white">{filteredUsers.length}</span> users
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Previous
          </button>
          <div className="px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white">
            Page {page} of {totalPages || 1}
          </div>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages || totalPages === 0}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

