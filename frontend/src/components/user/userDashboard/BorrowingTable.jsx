import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../../context/UserContext";
import { format } from "date-fns";

function BorrowRecordCard({ borrowRecord }) {
  const { book } = borrowRecord;
  const isOverdue = new Date(borrowRecord.due_date) < new Date();
  const daysUntilDue = Math.ceil((new Date(borrowRecord.due_date) - new Date()) / (1000 * 60 * 60 * 24));

  const formatDate = (date) => format(new Date(date), "dd/MM/yy");

  const getStatusInfo = () => {
    if (isOverdue) {
      return { 
        icon: '🚨', 
        label: 'OVERDUE', 
        color: 'bg-red-500', 
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-300 dark:border-red-700/50',
        textColor: 'text-red-700 dark:text-red-200'
      };
    }
    if (daysUntilDue <= 3) {
      return { 
        icon: '⚠️', 
        label: 'DUE SOON', 
        color: 'bg-yellow-500', 
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-300 dark:border-yellow-700/50',
        textColor: 'text-yellow-700 dark:text-yellow-200'
      };
    }
    return { 
      icon: '✓', 
      label: 'ACTIVE', 
      color: 'bg-green-500', 
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-300 dark:border-green-700/50',
      textColor: 'text-green-700 dark:text-green-200'
    };
  };

  const status = getStatusInfo();

  return (
    <div className={`bg-white dark:bg-slate-700 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out hover:scale-105 group border-l-4 ${isOverdue ? 'border-red-500' : 'border-green-500'}`}>
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-800">
        <img
          src={`http://localhost:8000/storage/${book.image}`}
          alt={book.title}
          className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${status.color} text-white shadow-md`}>
            {status.icon} {status.label}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1.5 rounded-lg shadow-lg font-bold text-sm">
          {isOverdue ? '⏱️ Late' : `📅 ${daysUntilDue}d left`}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
          <h2 className="text-lg font-bold text-white truncate">{book.title}</h2>
          <p className="text-white/80 text-xs mt-1">by {book.author?.name || 'Unknown Author'}</p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className={`border border-solid rounded-lg p-3 ${status.bgColor} ${status.borderColor}`}>
          <p className={`text-xs font-semibold ${status.textColor}`}>{status.label}</p>
          <p className={`text-sm font-bold mt-1 ${status.textColor}`}>
            {isOverdue ? '⚠️ Return immediately' : `Due on ${formatDate(borrowRecord.due_date)}`}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Category</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{book.category?.name || 'N/A'}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Borrowed</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatDate(borrowRecord.borrow_date)}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-600 pt-3">
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
            {book.description || 'No description available'}
          </p>
        </div>

        <button className={`w-full mt-3 py-2.5 px-4 font-bold text-sm rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg text-white ${isOverdue ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700' : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'}`}>
          {isOverdue ? '📍 Return Now' : '✓ Book Received'}
        </button>
      </div>
    </div>
  );
}

export function BorrowingTable() {
  const { user } = useUser();
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [filteredBorrowRecords, setFilteredBorrowRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Récupération du message de succès depuis l'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get("message");
    if (message) setSuccessMessage(message);
  }, []);

  // Récupération des emprunts de l'utilisateur
  useEffect(() => {
    if (!user?.id) return; // protection si user non encore chargé
    setLoading(true);
    axiosClient
        .get(`/borrow-records/user/${user.id}`)
        .then((response) => {
          setBorrowRecords(response.data);
          setFilteredBorrowRecords(response.data);
        })
        .catch((error) => console.error("Error fetching borrow records:", error))
        .finally(() => setLoading(false));
  }, [user]);

  // Filtrage en fonction du terme de recherche
  useEffect(() => {
    const filtered = borrowRecords.filter((record) => {
      const searchString = searchTerm.toLowerCase();
      return (
          (record.book?.title || "").toLowerCase().includes(searchString) ||
          (record.book?.description || "").toLowerCase().includes(searchString) ||
          (record.book?.author?.name || "").toLowerCase().includes(searchString) ||
          (record.book?.category?.name || "").toLowerCase().includes(searchString) ||
          (record.borrow_date || "").toLowerCase().includes(searchString) ||
          ((record.return_date
                  ? new Date(record.return_date).toISOString().slice(0, 10)
                  : "Not returned yet"
          ).toLowerCase().includes(searchString))
      );
    });
    setFilteredBorrowRecords(filtered);
    setPage(1); // Reset page lors d'une nouvelle recherche
  }, [searchTerm, borrowRecords]);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const totalPages = Math.ceil(filteredBorrowRecords.length / perPage);
  const paginatedBorrowRecords = filteredBorrowRecords.slice(
      (page - 1) * perPage,
      page * perPage
  );

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
        <div className="p-4 mb-6 text-green-700 dark:text-green-200 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700/50 rounded-lg font-medium" role="alert">
          ✓ {successMessage}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Borrowing List</h2>
        <p className="text-slate-600 dark:text-slate-400">Books you currently have borrowed</p>
      </div>

      {filteredBorrowRecords.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-6 rounded">
          <p className="text-blue-700 dark:text-blue-200 font-semibold">
            📚 You have {filteredBorrowRecords.length} book{filteredBorrowRecords.length > 1 ? 's' : ''} borrowed
          </p>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 mb-6 space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full py-2 px-4 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Search by book title or author..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Show</span>
            <select
              value={perPage}
              onChange={(e) => setPerPage(parseInt(e.target.value))}
              className="py-2 px-3 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {[5, 10, 15, 20].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              className="py-2 px-4 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 dark:text-white transition-colors"
              disabled={page === 1}
            >
              ← Prev
            </button>
            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">
              {page} / {totalPages || 1}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              className="py-2 px-4 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 dark:text-white transition-colors"
              disabled={page === totalPages || totalPages === 0}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {paginatedBorrowRecords.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Books Borrowed</h3>
          <p className="text-slate-600 dark:text-slate-400 text-lg">Start browsing and borrow some books!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedBorrowRecords.map((record) => (
          <BorrowRecordCard key={record.id} borrowRecord={record} />
        ))}
      </div>
    </div>
  );
}
