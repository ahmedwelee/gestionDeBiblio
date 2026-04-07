import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash , faPlus} from "@fortawesome/free-solid-svg-icons";

function BookCard({ book, onDelete }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white dark:bg-midnight-card rounded-xl overflow-hidden shadow-lg dark:shadow-glass-lg hover:shadow-xl dark:hover:shadow-glass-xl transition-shadow duration-300 ease-in-out border border-slate-200 dark:border-midnight-border">
      <div className="relative">
      <img
        src={`http://localhost:8000/storage/${book.image}`}
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
        <div className="p-4 mb-6 text-green-700 bg-green-100 rounded-xl" role="alert">
          <p>{successMessage}</p>
        </div>
      )}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-200 transition-colors duration-500">Books List</h2>
        <Link to="/admin/dashboard/books/add">
          <button className="inline-flex items-center bg-gradient-to-r from-brand-primary to-brand-primary-dark hover:from-brand-primary-dark hover:to-brand-primary text-white px-6 py-3 rounded-lg shadow-md transition-all duration-200">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            <span>Add Book</span>
          </button>
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="w-full sm:w-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full py-3 px-4 border border-gray-300 dark:border-midnight-border rounded-lg shadow-sm dark:bg-midnight-card dark:text-slate-200 focus:ring-2 focus:ring-brand-primary dark:focus:ring-brand-primary focus:border-transparent transition-colors duration-200"
            placeholder="Search books..."
          />
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
             <span className="text-gray-600 dark:text-slate-400 transition-colors duration-500">Show</span>
           <select
             value={perPage}
             onChange={(e) => setPerPage(parseInt(e.target.value))}
             className="py-2 px-3 border border-gray-300 dark:border-midnight-border rounded-lg shadow-sm dark:bg-midnight-card dark:text-slate-200 focus:ring-2 focus:ring-brand-primary dark:focus:ring-brand-primary focus:border-transparent transition-colors duration-200"
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
             className="py-2 px-4 border border-gray-300 dark:border-midnight-border rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-midnight-border dark:bg-midnight-card dark:text-slate-200 disabled:opacity-50 disabled:hover:bg-white dark:disabled:hover:bg-midnight-card transition-all duration-200"
             disabled={page === 1}
           >
             Previous
           </button>
             <span className="text-gray-600 dark:text-slate-400 transition-colors duration-500">
             Page {page} of {totalPages}
           </span>
           <button
             onClick={() => setPage(page + 1)}
             className="py-2 px-4 border border-gray-300 dark:border-midnight-border rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-midnight-border dark:bg-midnight-card dark:text-slate-200 disabled:opacity-50 disabled:hover:bg-white dark:disabled:hover:bg-midnight-card transition-all duration-200"
             disabled={page === totalPages}
           >
             Next
           </button>
         </div>
       </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedBooks.map((book) => (
          <BookCard key={book.id} book={book} onDelete={handleDelete} />
        ))}
      </div>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-gray-600 dark:text-slate-400 transition-colors duration-500">
          Showing {Math.min((page - 1) * perPage + 1, filteredBooks.length)} to {Math.min(page * perPage, filteredBooks.length)} of {filteredBooks.length} results
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(page - 1)}
            className="py-2 px-4 border border-gray-300 dark:border-midnight-border rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-midnight-border dark:bg-midnight-card dark:text-slate-200 disabled:opacity-50 disabled:hover:bg-white dark:disabled:hover:bg-midnight-card transition-all duration-200"
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-gray-600 dark:text-slate-400 transition-colors duration-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            className="py-2 px-4 border border-gray-300 dark:border-midnight-border rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-midnight-border dark:bg-midnight-card dark:text-slate-200 disabled:opacity-50 disabled:hover:bg-white dark:disabled:hover:bg-midnight-card transition-all duration-200"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

