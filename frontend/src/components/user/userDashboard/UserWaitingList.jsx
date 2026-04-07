import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../../context/UserContext";

function WaitingListCard({ waitingList, onDelete }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="relative">
      <img
        src={`http://localhost:8000/storage/${waitingList.book.image}`}
        alt={waitingList.book.title}
          className="h-64 w-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <button
            onClick={() => onDelete(waitingList.id)}
            className="bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faTrash} className="text-red-500 h-4 w-4" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h2 className="text-xl font-bold text-white truncate">{waitingList.book.title}</h2>
          <p className="text-white/90 text-sm">Joined: {waitingList.joined_at}</p>
        </div>
      </div>
      
      <div className="p-5">
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <span className="text-sm font-medium w-24">Status:</span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              Waiting
            </span>
          </div>
          <div className="mt-3">
            <p className="text-sm text-gray-600 line-clamp-2">
              {waitingList.book.description}
        </p>
      </div>
        </div>
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
        <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-lg" role="alert">
          <p>{successMessage}</p>
        </div>
      )}

      <div className="flex justify-between items-center py-4">
        <h2 className="text-2xl font-semibold">My Waiting List</h2>
      </div>

      <div className="flex items-center justify-between py-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm"
          placeholder="Search..."
        />

        <div className="space-x-2">
          <span className="text-sm">Show</span>
          <select
            value={perPage}
            onChange={(e) => setPerPage(parseInt(e.target.value))}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm"
          >
            {[5, 10, 15, 20].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedWaitingLists.map((waitingList) => (
          <WaitingListCard key={waitingList.id} waitingList={waitingList} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

