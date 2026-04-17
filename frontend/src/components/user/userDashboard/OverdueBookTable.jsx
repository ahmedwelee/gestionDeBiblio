/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { useUser } from "../../../context/UserContext";
import moment from "moment";
import { format } from "date-fns";

function BorrowRecordCard({ borrowRecord }) {
  const dueDate = new Date(borrowRecord.due_date);
  const diff = moment().diff(moment(dueDate), "days");
  
  const formatDate = (date) => {
    return format(new Date(date), "dd/MM/yy");
  };

  // Determine urgency level
  const getUrgencyLevel = () => {
    if (diff > 14) return { level: 'critical', color: 'from-red-600 to-red-700', icon: '🚨', badge: 'CRITICAL' };
    if (diff > 7) return { level: 'high', color: 'from-orange-600 to-orange-700', icon: '⚠️', badge: 'HIGH' };
    return { level: 'moderate', color: 'from-yellow-600 to-yellow-700', icon: '⏰', badge: 'MODERATE' };
  };

  const urgency = getUrgencyLevel();

  return (
    <div className="bg-white dark:bg-slate-700 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out hover:scale-105 group border-l-4 border-red-500">
      {/* Image Section */}
      <div className={`relative h-64 overflow-hidden bg-gradient-to-br ${urgency.color}`}>
        <img
          src={`http://localhost:8000/storage/${borrowRecord.book.image}`}
          alt={borrowRecord.book.title}
          className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-300 opacity-80 group-hover:opacity-100"
        />
        {/* Urgency Badge - Top Left */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white shadow-lg`}>
            {urgency.icon} {urgency.badge}
          </span>
        </div>
        {/* Days Overdue - Top Right */}
        <div className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg shadow-lg font-bold text-sm">
          {diff} days late
        </div>
        {/* Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
          <h2 className="text-lg font-bold text-white truncate">{borrowRecord.book.title}</h2>
          <p className="text-white/80 text-xs mt-1">by {borrowRecord.book.author?.name || 'Unknown Author'}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Alert Box */}
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-3 rounded">
          <p className="text-xs text-red-600 dark:text-red-300 font-semibold">⚠️ ACTION REQUIRED</p>
          <p className="text-sm text-red-700 dark:text-red-200 font-bold mt-1">Return ASAP to avoid penalties</p>
        </div>

        {/* Book Details */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Category</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{borrowRecord.book.category?.name || 'N/A'}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Borrowed</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatDate(borrowRecord.borrow_date)}</p>
            </div>
          </div>
        </div>

        {/* Due Date Info */}
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700/50 rounded-lg p-3">
          <p className="text-xs font-medium text-red-600 dark:text-red-300">Due Date</p>
          <p className="text-sm font-bold text-red-700 dark:text-red-200">{formatDate(borrowRecord.due_date)}</p>
        </div>

        {/* Description */}
        <div className="border-t border-slate-200 dark:border-slate-600 pt-3">
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
            {borrowRecord.book.description || 'No description available'}
          </p>
        </div>

        {/* Action Button */}
        <button className="w-full mt-3 py-2.5 px-4 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold text-sm rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
          📍 Return Book Now
        </button>
      </div>
    </div>
  );
}

export function OverdueBookTable() {
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
      .get(`/borrow-records/user/${user.id}/overdue`)
      .then((response) => {
        console.log("BorrowRecords:", response.data);
        console.log("User ID:", user.id);

        setBorrowRecords(response.data);
        setFilteredBorrowRecords(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching borrow records:", error);
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    const filtered = borrowRecords.filter((record) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        (record.book?.title || '').toLowerCase().includes(searchTermLower) ||
        (record.book?.author?.name || '').toLowerCase().includes(searchTermLower) ||
        (record.borrow_date || '').toLowerCase().includes(searchTermLower) ||
        ((record.return_date ? new Date(record.return_date).toISOString().slice(0, 10) : '') || '').toLowerCase().includes(searchTermLower) ||
        (record.due_date ? moment(record.due_date).fromNow() : '').toLowerCase().includes(searchTermLower)
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
          className="spinner-border animate-spin inline-block w-8 h-8 border-b-2 border-primary-500 rounded-full"
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
        <div className="p-4 mb-6 text-primary-700 dark:text-primary-200 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700/50 rounded-lg font-medium" role="alert">
          ✓ {successMessage}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Overdue Books</h2>
        <p className="text-slate-600 dark:text-slate-400">Books that need to be returned urgently</p>
      </div>

      {filteredBorrowRecords.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6 rounded">
          <p className="text-red-700 dark:text-red-200 font-semibold">
            ⚠️ You have {filteredBorrowRecords.length} overdue book{filteredBorrowRecords.length > 1 ? 's' : ''}. Please return them as soon as possible to avoid penalties.
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
              className="w-full py-2 px-4 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Search by book title or author..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Show</span>
            <select
              value={perPage}
              onChange={(e) => setPerPage(parseInt(e.target.value))}
              className="py-2 px-3 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
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
          <div className="text-6xl mb-4">✨</div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Overdue Books!</h3>
          <p className="text-slate-600 dark:text-slate-400 text-lg">Great! All your borrowed books are on time.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedBorrowRecords.map((borrowRecord) => (
          <BorrowRecordCard key={borrowRecord.id} borrowRecord={borrowRecord} />
        ))}
      </div>
    </div>
  );
}
