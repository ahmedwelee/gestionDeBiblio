import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../../context/UserContext";
import { format } from "date-fns";

function BorrowRecordCard({ borrowRecord }) {
  const { book } = borrowRecord;
  const isOverdue = new Date(borrowRecord.due_date) < new Date();

  const formatDate = (date) => format(new Date(date), "dd/MM/yy");

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
          <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isOverdue ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}
          >
            {isOverdue ? 'Overdue' : 'Active'}
          </span>
            <span className="text-sm text-gray-600">
            Due: {formatDate(borrowRecord.due_date)}
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
              <p className="text-sm text-gray-600 line-clamp-2">{book.description}</p>
            </div>
          </div>
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
            <div
                className="p-4 mb-4 text-green-700 bg-green-100 rounded-lg"
                role="alert"
            >
              <p>{successMessage}</p>
            </div>
        )}

        <div className="flex justify-between items-center py-4">
          <h2 className="text-2xl font-semibold">My Borrowing List</h2>
        </div>

        <div className="flex items-center justify-between py-4">
          <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm"
              placeholder="Search..."
          />
          <div className="flex items-center space-x-2">
            <span className="text-sm">Show</span>
            <select
                value={perPage}
                onChange={(e) => setPerPage(parseInt(e.target.value))}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm"
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
                disabled={page === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedBorrowRecords.map((record) => (
              <BorrowRecordCard key={record.id} borrowRecord={record} />
          ))}
        </div>
      </div>
  );
}
