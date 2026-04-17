import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../../context/UserContext";

function WaitingListCard({ waitingList, onDelete }) {
  const joinedDate = new Date(waitingList.joined_at);
  const formattedDate = joinedDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <div className="bg-white dark:bg-slate-700 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out hover:scale-105 group">
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-800">
        <img
          src={`http://localhost:8000/storage/${waitingList.book.image}`}
          alt={waitingList.book.title}
          className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-300"
        />
        {/* Status Badge - Top Left */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-400 dark:bg-yellow-500 text-yellow-900 dark:text-yellow-100 shadow-md">
            ⏳ In Queue
          </span>
        </div>
        {/* Delete Button - Top Right */}
        <button
          onClick={() => onDelete(waitingList.id)}
          className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-white transform hover:scale-110"
          title="Remove from waiting list"
        >
          <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
        </button>
        {/* Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
          <h2 className="text-lg font-bold text-white truncate">{waitingList.book.title}</h2>
          <p className="text-white/80 text-xs mt-1">by {waitingList.book.author?.name || 'Unknown Author'}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Queue Position Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-3">
          <p className="text-xs text-blue-600 dark:text-blue-300 font-semibold">📋 Position in Queue</p>
          <p className="text-sm text-blue-700 dark:text-blue-200 font-bold mt-1">Waiting for availability</p>
        </div>

        {/* Book Details */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Category</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{waitingList.book.category?.name || 'N/A'}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Joined</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{formattedDate}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="border-t border-slate-200 dark:border-slate-600 pt-3">
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
            {waitingList.book.description || 'No description available'}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onDelete(waitingList.id)}
          className="w-full mt-2 py-2 px-3 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-medium text-sm rounded-lg transition-colors duration-200 border border-red-200 dark:border-red-700/50"
        >
          Remove from Queue
        </button>
      </div>
    </div>
  );
}

export function UserWaitingListTable() {
  const { user, loading: userLoading } = useUser();
  const [waitingLists, setWaitingLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredWaitingLists, setFilteredWaitingLists] = useState([]);

  // Show message from URL param
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get("message");
    if (message) {
      setSuccessMessage(message);
    }
  }, []);

  // Fetch waiting list
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    axiosClient
      .get(`/waitingList/user/${user.id}`)
      .then((response) => {
        setWaitingLists(response.data);
        setFilteredWaitingLists(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching waiting lists:", error);
        setLoading(false);
      });
  }, [user]);

  // Search filter
  useEffect(() => {
    const filtered = waitingLists.filter(({ book, joined_at }) =>
      (book.title ? book.title.toLowerCase() : "").includes(searchTerm.toLowerCase()) ||
      (book.description ? book.description.toLowerCase() : "").includes(searchTerm.toLowerCase()) ||
      (joined_at ? joined_at.toLowerCase() : "").includes(searchTerm.toLowerCase())
    );
    setFilteredWaitingLists(filtered);
  }, [searchTerm, waitingLists]);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleDelete = (waitingListId) => {
    if (window.confirm("Are you sure you want to delete this waiting list?")) {
      axiosClient
        .delete(`/waitingList/${waitingListId}`)
        .then(() => {
          setWaitingLists((prev) => prev.filter((w) => w.id !== waitingListId));
          setSuccessMessage("Waiting list deleted successfully.");
        })
        .catch((error) => {
          console.error("Error deleting waiting list:", error);
          alert("Failed to delete waiting list.");
        });
    }
  };

  const paginatedWaitingLists = filteredWaitingLists.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filteredWaitingLists.length / perPage);

  // Loader if user or data is still loading
  if (userLoading || loading) {
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
    <div className="container mx-auto px-4">
      {successMessage && (
        <div className="p-4 mb-6 text-green-700 dark:text-green-200 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700/50 rounded-lg font-medium" role="alert">
          ✓ {successMessage}
        </div>
      )}

      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Waiting List</h2>
        <p className="text-slate-600 dark:text-slate-400">Track books you're waiting for</p>
      </div>

      {/* Controls Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 mb-6 space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full py-2 px-4 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Search by book title or description..."
            />
          </div>

          {/* Show entries */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Show</span>
            <select
              value={perPage}
              onChange={(e) => setPerPage(parseInt(e.target.value))}
              className="py-2 px-3 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {[5, 10, 15, 20].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Pagination */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="py-2 px-4 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 dark:text-white transition-colors"
            >
              ← Prev
            </button>
            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">
              {page} / {totalPages || 1}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages || totalPages === 0}
              className="py-2 px-4 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 dark:text-white transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {paginatedWaitingLists.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No waiting lists yet</h3>
          <p className="text-slate-600 dark:text-slate-400">Start following books you're interested in!</p>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedWaitingLists.map((waitingList) => (
          <WaitingListCard key={waitingList.id} waitingList={waitingList} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

