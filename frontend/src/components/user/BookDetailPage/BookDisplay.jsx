import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSpinner, FaBookOpen } from 'react-icons/fa';
import axiosClient from '../../../axiosClient';
import { getImageUrl } from '../../../utils/imageHelper';

const BookDisplay = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axiosClient.get('/books');
        setBooks(response.data);
        setFilteredBooks(response.data);
      } catch (err) {
        console.error('Erreur dans fetchBooks:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    const fetchCategoriesAndAuthors = async () => {
      try {
        const categoryResponse = await axiosClient.get('/books/categories');
        setCategories(categoryResponse.data);
  
        const authorResponse = await axiosClient.get('/books/authors');
        setAuthors(authorResponse.data);
      } catch (err) {
        console.error('Erreur dans fetchCategoriesAndAuthors:', err.message);
        setError(err.message);
      }
    };
  
    fetchBooks();
    fetchCategoriesAndAuthors();
  }, []);
  

  useEffect(() => {
    let filtered = books;
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(book => 
        book.category && book.category.name.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Apply author filter
    if (selectedAuthor) {
      filtered = filtered.filter(book => 
        book.author && book.author.name.toLowerCase() === selectedAuthor.toLowerCase()
      );
    }
    
    setFilteredBooks(filtered);
  }, [selectedCategory, selectedAuthor, books]);

  // Update category select options
  const categoryOptions = categories.map(category => (
    <option key={category.id} value={category.name}>
      {category.name}
    </option>
  ));

  // Update author select options
  const authorOptions = authors.map(author => (
    <option key={author.id || author} value={author.name || author}>
      {author.name || author}
    </option>
  ));

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 font-semibold text-lg">
        Erreur : {error}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white via-slate-100 to-white dark:from-midnight-950 dark:via-slate-900 dark:to-midnight-950 py-20 px-6 md:px-12 font-sans transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-midnight-text flex justify-center items-center gap-3 transition-colors duration-500">
            <FaBookOpen className="text-primary-600 dark:text-primary-400" />
            Explore Our Library
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto transition-colors duration-500">
            Discover new stories, timeless classics, and hidden gems. Let your next adventure begin here.
          </p>
        </div>

        <div className="flex justify-between mb-10">
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 border border-slate-300 dark:border-midnight-border rounded-md bg-white dark:bg-midnight-card text-slate-900 dark:text-midnight-text transition-colors duration-500"
            >
              <option value="">All Categories</option>
              {categoryOptions}
            </select>

            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="p-2 border border-slate-300 dark:border-midnight-border rounded-md bg-white dark:bg-midnight-card text-slate-900 dark:text-midnight-text transition-colors duration-500"
            >
              <option value="">All Authors</option>
              {authorOptions}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <FaSpinner className="animate-spin text-4xl text-primary-600 dark:text-primary-400" />
          </div>
        ) : (
          <>
            {filteredBooks.length === 0 ? (
              <div className="text-center py-10 text-slate-600 dark:text-slate-400 font-semibold text-lg transition-colors duration-500">
                No books match your filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                {filteredBooks.slice(0, visibleCount).map((book) => (
                  <div
                    key={book.id}
                    className="bg-white dark:bg-midnight-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl dark:hover:shadow-glass-lg transition-shadow duration-300 ease-in-out border border-slate-200 dark:border-midnight-border/30"
                  >
                    <div className="relative">
                      <img
                        src={getImageUrl(book.image)}
                        alt={book.title}
                        className="h-64 w-full object-cover transform hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h2 className="text-xl font-bold text-white truncate">
                        <Link
                          to={`/book/${book.id}`}
                            className="hover:text-primary-300 transition-colors duration-200"
                        >
                          {book.title}
                        </Link>
                      </h2>
                        <p className="text-white/90 text-sm">{book.author ? book.author.name : ''}</p>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">${book.price}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          book.quantity > 0 
                          ? 'bg-primary-100 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300' 
                          : 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300'
                        } transition-colors duration-500`}>
                          {book.quantity > 0 ? 'Available' : 'Out of Stock'}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-slate-600 dark:text-slate-400 transition-colors duration-500">
                          <span className="text-sm font-medium w-24">Category:</span>
                          <span className="text-sm">{book.category ? book.category.name : '-'}</span>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 transition-colors duration-500">
                            {book.description}
                      </p>
                      <Link
                        to={`/book/${book.id}`}
                            className="mt-2 inline-block text-primary-600 dark:text-primary-400 font-medium hover:underline transition-colors duration-300"
                      >
                        View Details →
                      </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {visibleCount < filteredBooks.length && (
              <div className="flex justify-center mt-14">
                <button
                  onClick={handleLoadMore}
                  className="bg-primary-600 hover:bg-primary-700 text-white text-lg font-semibold px-8 py-3 rounded-full shadow-md transition-all duration-300 hover:scale-105"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookDisplay;
