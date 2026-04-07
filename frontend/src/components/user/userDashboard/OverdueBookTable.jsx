/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { useUser } from "../../../context/UserContext";
import moment from "moment";
import { format } from "date-fns";

function BorrowRecordCard({ borrowRecord }) {
  const dueDate = new Date(borrowRecord.due_date);
  const diff = moment().diff(moment(dueDate), "days");
  const formattedDueDate = <span className="text-red-600">{diff} days ago</span>;

  const formatDate = (date) => {
    return format(new Date(date), "dd/MM/yy");
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
      <img
        src={`http://localhost:8000/storage/${borrowRecord.book.image}`}
        alt={borrowRecord.book.title}
          className="h-64 w-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/70 to-transparent p-4">
          <h2 className="text-xl font-semibold text-white truncate">{borrowRecord.book.title}</h2>
          <p className="text-white/90 text-sm">{borrowRecord.book.author ? borrowRecord.book.author.name : ''}</p>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-primary-700">Due Date</span>
          <span className="text-sm text-red-600">{formattedDueDate}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-slate-600">
            <span className="text-sm font-medium w-24">Category:</span>
            <span className="text-sm">{borrowRecord.book.category ? borrowRecord.book.category.name : '-'}</span>
          </div>
          <div className="flex items-center text-slate-600">
            <span className="text-sm font-medium w-24">Borrowed:</span>
            <span className="text-sm">{formatDate(borrowRecord.borrow_date)}</span>
          </div>
          <div className="mt-3">
            <p className="text-sm text-slate-600 line-clamp-2">
              {borrowRecord.book.description}
            </p>
          </div>
        </div>
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
        <div className="p-4 mb-4 text-primary-700 bg-primary-50 border border-primary-200 rounded-xl" role="alert">
          <p>{successMessage}</p>
        </div>
      )}
      <div className="flex justify-between items-center py-4">
        <h2 className="text-2xl font-semibold text-slate-900">My Overdue Books List</h2>
      </div>
      <div className="flex items-center justify-between py-4 gap-4 flex-wrap">
        <div className="space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="py-2 px-4 border border-slate-200 rounded-xl shadow-sm"
            placeholder="Search..."
          />
        </div>
        <div className="space-x-2">
          <span className="text-sm text-slate-600">Show</span>
          <select
            value={perPage}
            onChange={(e) => setPerPage(parseInt(e.target.value))}
            className="py-2 px-4 border border-slate-200 rounded-xl shadow-sm"
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
            className="py-2 px-4 border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 disabled:opacity-50"
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-sm text-slate-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            className="py-2 px-4 border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 disabled:opacity-50"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedBorrowRecords.map((borrowRecord) => (
          <BorrowRecordCard key={borrowRecord.id} borrowRecord={borrowRecord} />
        ))}
      </div>
    </div>
  );
}
