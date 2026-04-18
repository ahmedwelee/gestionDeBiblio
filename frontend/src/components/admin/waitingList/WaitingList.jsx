import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { getImageUrl } from "../../../utils/imageHelper";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash , faPlus} from "@fortawesome/free-solid-svg-icons";

function WaitingListCard({ waitingList, onDelete }) {
  const navigate = useNavigate();
  const { book, user } = waitingList;
  return (
    <div className="bg-white dark:bg-midnight-card rounded-xl overflow-hidden shadow-lg dark:shadow-glass-lg hover:shadow-xl dark:hover:shadow-glass-xl transition-shadow duration-300 ease-in-out border border-slate-200 dark:border-midnight-border">
      <div className="relative">
      <img
        src={getImageUrl(book.image)}
        alt={book.title}
          className="h-64 w-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <button
            onClick={() => onDelete(waitingList.id)}
            className="bg-white dark:bg-red-950/30 p-2 rounded-full shadow-md dark:shadow-glass-sm hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faTrash} className="text-red-500 dark:text-red-400 h-4 w-4" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h2 className="text-xl font-bold text-white truncate">{book.title}</h2>
          <p className="text-white/90 text-sm">{user ? user.name : ''}</p>
        </div>
      </div>
      
      <div className="p-5">
        <div className="space-y-2">
          <div className="flex items-center text-slate-600 dark:text-slate-400 transition-colors duration-500">
            <span className="text-sm font-medium w-24">Category:</span>
            <span className="text-sm">{book.category ? book.category.name : '-'}</span>
          </div>
          <div className="flex items-center text-slate-600 dark:text-slate-400 transition-colors duration-500">
            <span className="text-sm font-medium w-24">Author:</span>
            <span className="text-sm">{book.author ? book.author.name : '-'}</span>
          </div>
          <div className="mt-3">
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 transition-colors duration-500">
              {book.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WaitingListTable() {
  const [waitingLists, setWaitingLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredWaitingLists, setFilteredWaitingLists] = useState([]);

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
      .get(`/waitingList`)
      .then((response) => {
        console.log("WaitingLists:", response.data);
        setWaitingLists(response.data);
        setFilteredWaitingLists(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching waitingLists:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = waitingLists.filter((waitingList) => {
      const searchString = searchTerm.toLowerCase();
      return (
        (waitingList.book?.title || '').toLowerCase().includes(searchString) ||
        (waitingList.book?.description || '').toLowerCase().includes(searchString) ||
        (waitingList.book?.author?.name || '').toLowerCase().includes(searchString) ||
        (waitingList.book?.category?.name || '').toLowerCase().includes(searchString) ||
        (waitingList.user?.name || '').toLowerCase().includes(searchString)
      );
    });
    
    setFilteredWaitingLists(filtered);
  }, [searchTerm, waitingLists]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (waitingListId) => {
    if (window.confirm("Are you sure you want to delete this waitingList?")) {
      axiosClient
        .delete(`/waitingList/${waitingListId}`)
        .then(() => {
          setWaitingLists((prevWaitingLists) => prevWaitingLists.filter((waitingList) => waitingList.id !== waitingListId));
          setSuccessMessage("WaitingList deleted successfully.");
        })
        .catch((error) => {
          console.error("Error deleting waitingList:", error);
          alert("Failed to delete waitingList.");
        });
    }
  };

  const paginatedWaitingLists = filteredWaitingLists.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filteredWaitingLists.length / perPage);

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
    <div className="container mx-auto px-4">
      {successMessage && (
        <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-lg" role="alert">
          <p>{successMessage}</p>
        </div>
      )}
      <div className="flex justify-between items-center py-4">
        <h2 className="text-2xl font-semibold">WaitingLists List</h2>
        <Link to="/admin/dashboard/waitingList/add">
          <button className="inline-flex items-center bg-[#274e79] text-white px-4 py-2 rounded shadow">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span className="ml-2">Add WaitingList</span>
          </button>
        </Link>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-md"
            placeholder="Search..."
          />
        </div>
        <div className="space-x-2">
          <span className="text-sm">Show</span>
          <select
            value={perPage}
            onChange={(e) => setPerPage(parseInt(e.target.value))}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-md"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-md hover:bg-gray-50 disabled:opacity-50"
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-md hover:bg-gray-50 disabled:opacity-50"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedWaitingLists.map((waitingList) => (
          <WaitingListCard key={waitingList.id} waitingList={waitingList} onDelete={handleDelete} />
        ))}
      </div>
      {/* <div className="flex items-center justify-between py-4">
        <span className="text-sm">
          Showing {Math.min((page - 1) * perPage + 1, filteredWaitingLists.length)} to {Math.min(page * perPage, filteredWaitingLists.length)} of {filteredWaitingLists.length} results
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-md hover:bg-gray-50 disabled:opacity-50"
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-md hover:bg-gray-50 disabled:opacity-50"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div> */}
    </div>
  );
}
export default WaitingListTable;

