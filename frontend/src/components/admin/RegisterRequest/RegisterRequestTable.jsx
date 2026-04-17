import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from "../../../LibraryDashboard.module.css";

function RequestTableRow({ index, request, onDelete, onApprove }) {
  return (
    <div className="group flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
      <div className="flex-1 min-w-0 grid grid-cols-4 gap-4">
        <div><p className="text-sm text-slate-900 dark:text-slate-100">{request.name}</p></div>
        <div className="hidden sm:block"><p className="text-sm text-slate-600 dark:text-slate-300 truncate">{request.gmail}</p></div>
        <div><p className="text-sm text-slate-600 dark:text-slate-300">{request.phone}</p></div>
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => onApprove(request.id)} className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors duration-200">Approve</button>
          <button onClick={() => onDelete(request.id)} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors duration-200">Delete</button>
        </div>
      </div>
    </div>
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
    <div className="w-full">
      {successMessage && (<div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-lg"><p className="text-sm text-green-700 dark:text-green-200">{successMessage}</p></div>)}
      <div className="mb-8"><h1 className="text-3xl font-bold text-slate-900 dark:text-white">Registration Requests</h1><p className="text-slate-600 dark:text-slate-400 mt-1">Manage user registration requests</p></div>
      <div className="mb-6 flex-1"><div className="relative"><FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3.5 text-slate-400" /><input type="text" value={searchTerm} onChange={handleSearch} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="Search requests..." /></div></div>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-b font-semibold text-sm text-slate-700 dark:text-slate-300"><div>Name</div><div>Email</div><div>Phone</div><div className="text-right">Actions</div></div>
        <div>{paginatedRequests.length > 0 ? paginatedRequests.map((req) => (<RequestTableRow key={req.id} index={requests.indexOf(req)} request={req} onDelete={handleDelete} onApprove={handleApprove} />)) : (<div className="px-6 py-12 text-center"><p className="text-slate-600 dark:text-slate-400">No requests found</p></div>)}</div>
      </div>
      <div className="mt-6 flex justify-between"><div className="text-sm text-slate-600">Showing {Math.min((page - 1) * perPage + 1, filteredRequests.length)} to {Math.min(page * perPage, filteredRequests.length)} of {filteredRequests.length}</div><div className="flex gap-2"><button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-4 py-2 bg-white dark:bg-slate-800 border rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50">Previous</button><div className="px-4 py-2">Page {page} of {totalPages || 1}</div><button onClick={() => setPage(page + 1)} disabled={page === totalPages || totalPages === 0} className="px-4 py-2 bg-white dark:bg-slate-800 border rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50">Next</button></div></div>
    </div>
  );
}

