import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../../context/UserContext";
import { format } from "date-fns";

function BorrowRecordCard({ borrowRecord }) {
  const { book } = borrowRecord;
  const isReturned = borrowRecord.return_date !== null;

  const formatDate = (date) => {
    return format(new Date(date), "dd/MM/yy");
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="relative">
      <img
          src={`http://localhost:8000/storage/${book.image}`}
          alt={book.title}
          className="h-64 w-full object-cover transform hover:scale-105 transition-transform duration-300"
      />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h2 className="text-xl font-bold text-white truncate">{book.title}</h2>
          <p className="text-white/90 text-sm">{book.author ? book.author.name : ''}</p>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isReturned 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isReturned ? 'Returned' : 'Not Returned'}
          </span>
          <span className="text-sm text-gray-600">
            {isReturned 
              ? `Returned: ${formatDate(borrowRecord.return_date)}`
              : `Due: ${formatDate(borrowRecord.due_date)}`
            }
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <span className="text-sm font-medium w-24">Category:</span>
            <span className="text-sm">{book.category ? book.category.name : '-'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="text-sm font-medium w-24">Borrowed:</span>
            <span className="text-sm">{formatDate(borrowRecord.borrow_date)}</span>
          </div>
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

export function HistoryTable() {
  const { user } = useUser();
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
    if (!user) return;
    setLoading(true);
    axiosClient
      .get(`/borrow-records/user/${user.id}/history`)
      .then((response) => {
        setBorrowRecords(response.data);
        setFilteredBorrowRecords(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching borrow records:", error);
        setLoading(false);
      });
  }, [user.id]);

  useEffect(() => {
    const filtered = borrowRecords.filter((borrowRecord) => {
      const searchString = searchTerm.toLowerCase();
      return (
        (borrowRecord.book?.title || '').toLowerCase().includes(searchString) ||
        (borrowRecord.book?.description || '').toLowerCase().includes(searchString) ||
        (borrowRecord.book?.author?.name || '').toLowerCase().includes(searchString) ||
        (borrowRecord.book?.category?.name || '').toLowerCase().includes(searchString) ||
        (borrowRecord.borrow_date || '').toLowerCase().includes(searchString) ||
        (borrowRecord.return_date || '').toLowerCase().includes(searchString)
      );
    });
    
    setFilteredBorrowRecords(filtered);
  }, [searchTerm, borrowRecords]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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
        <h2 className="text-2xl font-semibold">History</h2>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedBorrowRecords.map((borrowRecord, index) => (
          <BorrowRecordCard key={borrowRecord.id} borrowRecord={borrowRecord} />
        ))}
      </div>
    </div>
  );
}

