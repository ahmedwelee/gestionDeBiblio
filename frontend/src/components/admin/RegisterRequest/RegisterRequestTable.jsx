import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from "../../../LibraryDashboard.module.css";

function RequestTableRow({ index, request, onDelete, onApprove }) {
  const navigate = useNavigate();
  return (
    <tr className={`${styles.tableRow} transition-all duration-200`}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200 transition-colors duration-500">{index + 1}</td>
      <td className="text-sm text-slate-900 dark:text-slate-300 font-light px-6 py-4 whitespace-nowrap transition-colors duration-500">{request.name}</td>
      <td className="text-sm text-slate-900 dark:text-slate-300 font-light px-6 py-4 whitespace-nowrap transition-colors duration-500">{request.gmail}</td>
      <td className="text-sm text-slate-900 dark:text-slate-300 font-light px-6 py-4 whitespace-nowrap transition-colors duration-500">{request.phone}</td>
      <td className="text-sm font-medium px-6 py-4 whitespace-nowrap">
        <div className={styles.actionButtons}>
        <button
          onClick={() => onApprove(request.id)}
            className={`${styles.actionButton} ${styles.approveButton}`}
            title="Approve request"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <button
          onClick={() => onDelete(request.id)}
            className={`${styles.actionButton} ${styles.deleteButton}`}
            title="Delete request"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
        </div>
      </td>
    </tr>
  );
}

export function RequestTable() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRequests, setFilteredRequests] = useState([]);

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
      .get(`/requests`)
      .then((response) => {
        setRequests(response.data);
        setFilteredRequests(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching requests:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = requests.filter(({ name, gmail, phone }) =>
      (name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (gmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (phone || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredRequests(filtered);
  }, [searchTerm, requests]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (requestId) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      axiosClient
        .delete(`/request/${requestId}`)
        .then(() => {
          setRequests((prevRequests) => prevRequests.filter((request) => request.id !== requestId));
          setSuccessMessage("Request deleted successfully.");
        })
        .catch((error) => {
          console.error("Error deleting request:", error);
          alert("Failed to delete request.");
        });
    }
  };

  const handleApprove = (requestId) => {
    if (window.confirm("Are you sure you want to approve this request?")) {
      axiosClient
        .post(`/request/${requestId}`)
        .then(() => {
          setRequests((prevRequests) => prevRequests.filter((request) => request.id !== requestId));
          setSuccessMessage("Request approved successfully.");
        })
        .catch((error) => {
          console.error("Error approving request:", error);
          alert("Failed to approve request.");
        });
    }
  };

  const paginatedRequests = filteredRequests.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filteredRequests.length / perPage);

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
          Requests List
        </h2>
      </div>

      <div className={styles.tableControls}>
        <div className="relative">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className={`${styles.searchInput} pl-10`}
            placeholder="Search requests..."
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
              <th scope="col" className="px-6 py-4 border-r border-white/10 font-semibold text-sm uppercase">Gmail</th>
              <th scope="col" className="px-6 py-4 border-r border-white/10 font-semibold text-sm uppercase">Phone</th>
              <th scope="col" className="px-6 py-4 font-semibold text-sm uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedRequests.map((request, index) => (
              <RequestTableRow
                key={request.id}
                index={(page - 1) * perPage + index}
                request={request}
                onDelete={handleDelete}
                onApprove={handleApprove}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

