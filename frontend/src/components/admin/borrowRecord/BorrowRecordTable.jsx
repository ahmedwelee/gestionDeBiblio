import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { getImageUrl } from "../../../utils/imageHelper";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

function BorrowRecordCard({ borrowRecord, onDelete }) {
  const navigate = useNavigate();
  const { book, user } = borrowRecord;
  const isReturned = borrowRecord.return_date !== null;
  const currentDate = new Date();
  const dueDate = new Date(borrowRecord.due_date);
  const isOverdue = !isReturned && currentDate > dueDate;

  const formatDate = (date) => {
    return format(new Date(date), "dd/MM/yy");
  };

  const getStatusStyle = () => {
    if (isReturned) {
      return 'bg-green-100 text-green-800';
    }
    if (isOverdue) {
      return 'bg-red-100 text-red-800 animate-pulse';
    }
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = () => {
    if (isReturned) {
      return 'Returned';
    }
    if (isOverdue) {
      return 'OVERDUE';
    }
    return 'Not Returned';
  };

  return (
    <div className="bg-white dark:bg-midnight-card rounded-xl overflow-hidden shadow-lg dark:shadow-glass-lg hover:shadow-xl dark:hover:shadow-glass-xl transition-shadow duration-300 ease-in-out border border-slate-200 dark:border-midnight-border">
      <div className="relative">
        <img
          src={getImageUrl(book.image)}
          alt={book.title}
          className="h-64 w-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
        {isOverdue && !isReturned && (
          <div className="absolute top-0 left-0 mt-4 ml-4">
            <div className="bg-red-600 dark:bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg dark:shadow-glass-sm">
              OVERDUE
            </div>
          </div>
        )}
        <div className="absolute top-0 right-0 mt-4 mr-4 space-x-2">
          {!isReturned && (
            <button
              onClick={() => onDelete(borrowRecord.id)}
              className="bg-white dark:bg-green-950/30 p-2 rounded-full shadow-md dark:shadow-glass-sm hover:bg-green-50 dark:hover:bg-green-900/50 transition-colors duration-200"
              title="Mark as Returned"
            >
              <svg 
                className="h-4 w-4 text-green-600 dark:text-green-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </button>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h2 className="text-xl font-bold text-white truncate">{book.title}</h2>
          <p className="text-white/90 text-sm">{user ? user.name : ''}</p>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle()}`}>
            {getStatusText()}
          </span>
          <span className={`text-sm transition-colors duration-500 ${isOverdue && !isReturned ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-slate-600 dark:text-slate-400'}`}>
            {isReturned 
              ? `Returned: ${formatDate(borrowRecord.return_date)}`
              : `Due: ${formatDate(borrowRecord.due_date)}`
            }
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-slate-600 dark:text-slate-400 transition-colors duration-500">
            <span className="text-sm font-medium w-24">Category:</span>
            <span className="text-sm">{book.category ? book.category.name : '-'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="text-sm font-medium w-24">Borrowed:</span>
            <span className="text-sm">{formatDate(borrowRecord.borrow_date)}</span>
          </div>
          {isOverdue && !isReturned && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">
                This book is overdue by {Math.ceil((currentDate - dueDate) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
          )}
          <div className="mt-3">
            <p className="text-sm text-gray-600 line-clamp-2">
              {book.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BorrowRecordTable() {
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBorrowRecords, setFilteredBorrowRecords] = useState([]);

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
      .get(`/borrow-records`)
      .then((response) => {
        setBorrowRecords(response.data);
        setFilteredBorrowRecords(response.data);
        setLoading(false);
        console.log("Borrow Records:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching borrow records:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = borrowRecords.filter((borrowRecord) => {
      const searchString = searchTerm.toLowerCase();
      return (
        (borrowRecord.book?.title || '').toLowerCase().includes(searchString) ||
        (borrowRecord.book?.description || '').toLowerCase().includes(searchString) ||
        (borrowRecord.book?.author?.name || '').toLowerCase().includes(searchString) ||
        (borrowRecord.book?.category?.name || '').toLowerCase().includes(searchString) ||
        (borrowRecord.user?.name || '').toLowerCase().includes(searchString) ||
        (borrowRecord.borrow_date || '').toLowerCase().includes(searchString) ||
        (borrowRecord.return_date || '').toLowerCase().includes(searchString) ||
        (borrowRecord.due_date || '').toLowerCase().includes(searchString)
      );
    });

    setFilteredBorrowRecords(filtered);
  }, [searchTerm, borrowRecords]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const markAsReturned = (borrowRecordId) => {
    if (window.confirm("Are you sure you want to mark this book as returned?")) {
      console.log("Marking book as returned with ID:", borrowRecordId);
      axiosClient
        .put(`/borrow-records/${borrowRecordId}`, { return_date: new Date().toISOString() })
        .then(() => {
          setBorrowRecords((prevBorrowRecords) => prevBorrowRecords.map((borrowRecord) => {
            if (borrowRecord.id === borrowRecordId) {
              return { ...borrowRecord, return_date: new Date().toISOString() };
            }
            return borrowRecord;
          }));
          setSuccessMessage("Book marked as returned successfully.");
        })
        .catch((error) => {
          console.error("Error updating borrow record:", error);
          alert("Failed to mark book as returned.");
        });
    }
  };

  const paginatedBorrowRecords = filteredBorrowRecords.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filteredBorrowRecords.length / perPage);

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
        <h2 className="text-2xl font-semibold">Borrow Records List</h2>
        <Link to="/admin/dashboard/borrow-records/add">
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
            <span className="ml-2">Add Borrow Record</span>
          </button>
        </Link>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm"
            placeholder="Search..."
          />
        </div>
        <div className="space-x-2">
          <span className="text-sm">Show</span>
          <select
            value={perPage}
            onChange={(e) => setPerPage(parseInt(e.target.value))}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm"
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
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50"
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedBorrowRecords.map((borrowRecord) => (
            <BorrowRecordCard
              key={borrowRecord.id}
              borrowRecord={borrowRecord}
              onDelete={markAsReturned}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

