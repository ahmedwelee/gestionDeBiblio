import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import axiosClient from "../../../axiosClient";
import styles from "../../../LibraryDashboard.module.css";

export default function WaitingListAddForm() {
  const [book_id, setBookId] = useState("");
  const [user_id, setUserId] = useState("");
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookSearch, setBookSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const booksRes = await axiosClient.get('/books');
      const usersRes = await axiosClient.get('/users');
      setBooks(booksRes.data);
      setUsers(usersRes.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredBooks(
      books.filter(({ title }) =>
        title.toLowerCase().includes(bookSearch.toLowerCase())
      )
    );
  }, [bookSearch, books]);

  useEffect(() => {
    setFilteredUsers(
      users.filter(({ name }) =>
        name.toLowerCase().includes(userSearch.toLowerCase())
      )
    );
  }, [userSearch, users]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:8000/api/waitingList/create', {
        book_id,
        user_id,
      });
      setError({});
      window.location.href = "/admin/dashboard/waitingList?message=Waiting list added successfully";
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const errors = error.response.data.errors;
        const errorObject = {};
        Object.keys(errors).forEach(key => {
          errorObject[key] = errors[key][0];
        });
        setError(errorObject);
      } else {
        setError({ general: "An unexpected error occurred. Please try again later." });
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-6">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="backdrop-blur-xl bg-white/60 shadow-xl rounded-3xl p-8 border border-gray-100">
          <header className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#274e79] to-[#1a3b5c] bg-clip-text text-transparent">
                Add to Waiting List
              </h2>
              <p className="text-gray-500 mt-1">Add a user to the book waiting list</p>
            </div>
            <Link 
              to="/admin/dashboard/waitingList" 
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 2.293a1 1 0 011.414 0l8 8a1 1 0 010 1.414l-8 8a1 1 0 01-1.414-1.414L16.586 11H3a1 1 0 110-2h13.586l-6.293-6.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </header>

          <div className="space-y-6">
            {loading && (
              <div className="flex items-center justify-center py-4 bg-white/80 rounded-xl backdrop-blur">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-[3px] border-current border-t-transparent text-brand-primary transition-colors duration-200"></div>
                <p className="ml-3 text-brand-primary font-medium">Processing...</p>
              </div>
            )}

            {error.general && (
              <div className="bg-red-50/50 backdrop-blur border-l-4 border-red-400 p-4 rounded-lg">
                <p className="text-red-700 text-sm">{error.general}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label htmlFor="book_id" className="block text-sm font-medium text-gray-700 mb-1">Book</label>
                <div className="relative group">
                   <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary to-brand-primary-dark rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-200"></div>
           <input
             type="search"
             list="books"
             value={bookSearch}
             onChange={(e) => {
               const value = e.target.value;
               setBookSearch(value);
               const selected = books.find(book => book.title === value);
               setBookId(selected ? selected.id : "");
             }}
                     className="relative w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-midnight-border bg-white/70 dark:bg-midnight-800/70 dark:text-slate-200 backdrop-blur focus:bg-white dark:focus:bg-midnight-800 focus:ring-2 focus:ring-brand-primary dark:focus:ring-brand-primary focus:border-transparent transition duration-200"
             placeholder="Search for book"
          />
          <datalist id="books">
            {filteredBooks.map(book => (
              <option key={book.id} value={book.title} />
            ))}
          </datalist>
                </div>
                {error.book_id && <p className="text-red-500 text-xs mt-1">{error.book_id}</p>}
        </div>

              <div className="relative">
                <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-1">User</label>
                <div className="relative group">
                   <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary to-brand-primary-dark rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-200"></div>
           <input
             type="search"
             list="users"
             value={userSearch}
             onChange={(e) => {
               const value = e.target.value;
               setUserSearch(value);
               const selected = users.find(user => user.name === value);
               setUserId(selected ? selected.id : "");
             }}
                     className="relative w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-midnight-border bg-white/70 dark:bg-midnight-800/70 dark:text-slate-200 backdrop-blur focus:bg-white dark:focus:bg-midnight-800 focus:ring-2 focus:ring-brand-primary dark:focus:ring-brand-primary focus:border-transparent transition duration-200"
             placeholder="Search for user"
          />
          <datalist id="users">
            {filteredUsers.map(user => (
              <option key={user.id} value={user.name} />
            ))}
          </datalist>
                </div>
                {error.user_id && <p className="text-red-500 text-xs mt-1">{error.user_id}</p>}
        </div>
      </div>

            <div className="flex justify-end pt-6">
               <button
                 type="submit"
                 disabled={loading}
                 className="relative inline-flex items-center px-6 py-3 overflow-hidden text-white rounded-xl group bg-gradient-to-r from-brand-primary to-brand-primary-dark hover:from-brand-primary-dark hover:to-brand-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/80 border-t-transparent"></div>
                    <span className="ml-2">Adding to List...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="ml-2">Add to List</span>
                  </>
                )}
      </button>
            </div>
          </div>
    </form>
      </div>
    </div>
  );
}


