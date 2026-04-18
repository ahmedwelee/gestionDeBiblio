import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash , faPlus} from "@fortawesome/free-solid-svg-icons";
import { getImageUrl } from "../../../utils/imageHelper";

function BookCard({ book, onDelete }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white dark:bg-midnight-card rounded-xl overflow-hidden shadow-lg dark:shadow-glass-lg hover:shadow-xl dark:hover:shadow-glass-xl transition-shadow duration-300 ease-in-out border border-slate-200 dark:border-midnight-border">
      <div className="relative">
      <img
        src={getImageUrl(book.image)}
        alt={book.title}
          className="h-64 w-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-0 right-0 mt-4 mr-4 space-x-2">
          <button
            onClick={() => navigate(`/admin/dashboard/books/edit/${book.id}`)}
            className="bg-white dark:bg-midnight-950 p-2 rounded-full shadow-md dark:shadow-glass-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faPencilAlt} className="text-slate-600 dark:text-slate-400 h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(book.id)}
            className="bg-white dark:bg-red-950/30 p-2 rounded-full shadow-md dark:shadow-glass-sm hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faTrash} className="text-red-500 dark:text-red-400 h-4 w-4" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h2 className="text-xl font-bold text-white truncate">{book.title}</h2>
          <p className="text-white/90 text-sm">{book.author ? book.author.name : ''}</p>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-primary-600 dark:text-primary-400 transition-colors duration-500">${book.price}</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-500 ${
            book.quantity > 0 
            ? 'bg-primary-100 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300' 
            : 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300'
          }`}>
            {book.quantity > 0 ? 'Available' : 'Out of Stock'}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-slate-600 dark:text-slate-400 transition-colors duration-500">
            <span className="text-sm font-medium w-24">Category:</span>
            <span className="text-sm">{book.category ? book.category.name : '-'}</span>
          </div>
          <div className="flex items-center text-slate-600 dark:text-slate-400 transition-colors duration-500">
            <span className="text-sm font-medium w-24">Quantity:</span>
            <span className="text-sm">{book.quantity}</span>
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

export function BookTable() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);

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
      .get(`/books`)
      .then((response) => {
        setBooks(response.data);
        setFilteredBooks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = books.filter(({ title, description, author_id, category_id, quantity, price }) =>
      (title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (author_id ? book.author.name : '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category_id ? book.category.name : '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quantity || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      (price || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quantity > 0 ? 'Disponible' : 'No disponible').toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      axiosClient
        .delete(`/books/${bookId}`)
        .then(() => {
          setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
          setSuccessMessage("Book deleted successfully.");
        })
        .catch((error) => {
          console.error("Error deleting book:", error);
          alert("Failed to delete book.");
        });
    }
  };

  const paginatedBooks = filteredBooks.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filteredBooks.length / perPage);

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
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {successMessage && (
        <div className="p-4 mb-6 text-green-700 dark:text-green-200 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700/50 rounded-lg font-medium" role="alert">
          ✓ {successMessage}
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Books Management</h2>
            <p className="text-slate-600 dark:text-slate-400">Manage library books and inventory</p>
          </div>
          <Link to="/admin/dashboard/books/add">
            <button className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              <span>Add Book</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full py-3 px-4 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Search books by title, author, or category..."
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Show</span>
            <select
              value={perPage}
              onChange={(e) => setPerPage(parseInt(e.target.value))}
              className="py-2 px-3 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(page - 1)}
              className="py-2 px-4 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 dark:text-white transition-colors"
              disabled={page === 1}
            >
              ← Prev
            </button>
            <span className="text-sm text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">
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

      {paginatedBooks.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Books Found</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Add books to get started</p>
          <Link to="/admin/dashboard/books/add">
            <button className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all">
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              <span>Add Your First Book</span>
            </button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {paginatedBooks.map((book) => (
          <BookCard key={book.id} book={book} onDelete={handleDelete} />
        ))}
      </div>

      {paginatedBooks.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg">
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            Showing {Math.min((page - 1) * perPage + 1, filteredBooks.length)} to {Math.min(page * perPage, filteredBooks.length)} of {filteredBooks.length} books
          </span>
        </div>
      )}
    </div>
  );
}

