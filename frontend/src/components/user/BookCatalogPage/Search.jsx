import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../../../axiosClient';
import { getImageUrl } from '../../../utils/imageHelper';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim() === '') return;
    setLoading(true);
    try {
      const res = await axiosClient.get(`/books/search?q=${query}`);
      setResults(res.data);
      setFilteredResults(res.data);
    } catch (err) {
      console.error('Search error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <div
      className="relative w-full min-h-[420px] bg-gradient-to-b from-primary-50 to-slate-50 dark:from-midnight-950 dark:to-slate-900 font-serif flex flex-col items-center justify-center py-16 transition-colors duration-500"
    >
      <div className="flex flex-col items-center justify-center px-4 w-full z-10">
        <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-center text-slate-900 dark:text-midnight-text transition-colors duration-500">
          Explore Our Library
        </h1>

        <form
          onSubmit={handleSearch}
          className="w-full max-w-2xl flex items-center bg-white dark:bg-midnight-card rounded-xl overflow-hidden shadow-md dark:shadow-glass-lg p-1 transition-all duration-500"
        >
          <input
            type="text"
            placeholder="Search a book by title or author..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow p-3 text-slate-800 dark:text-midnight-text placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none bg-white dark:bg-midnight-card border-0 shadow-none transition-colors duration-500"
          />
          <button
            type="submit"
            className="bg-primary-500 text-white px-6 py-3 font-semibold hover:bg-primary-600 transition-all rounded-xl"
          >
            Search
          </button>
        </form>

        {loading && (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        )}

        <AnimatePresence>
          {filteredResults.length > 0 && (
            <motion.div
              className="bg-white dark:bg-midnight-card mt-8 p-6 rounded-xl shadow-md dark:shadow-glass-lg w-full max-w-4xl overflow-y-auto max-h-[500px] text-slate-800 dark:text-midnight-text transition-colors duration-500"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ul className="space-y-4">
                {filteredResults.slice(0, visibleCount).map((book) => (
                  <motion.li
                    key={book.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      to={`/book/${book.id}`}
                      className="flex items-center space-x-4 bg-slate-50 dark:bg-midnight-950/50 hover:bg-primary-50 dark:hover:bg-primary-950/30 p-4 rounded-xl transition group border border-slate-200 dark:border-midnight-border/30 hover:border-primary-200 dark:hover:border-primary-500/30"
                    >
                      {book.image && (
                        <img
                          src={getImageUrl(book.image)}
                          alt={book.title}
                          className="w-16 h-24 object-cover rounded-xl shadow-sm group-hover:scale-105 transition-transform"
                        />
                      )}
                      <div className="text-left flex-grow">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-midnight-text group-hover:text-primary-700 dark:group-hover:text-primary-400 transition mb-1">
                          {book.title}
                        </h3>
                        <p className="text-md font-medium text-slate-600 dark:text-slate-300 transition-colors">
                          {book.author?.name || 'Unknown Author'}
                        </p>
                        <p className="text-sm px-2 py-1 bg-white dark:bg-midnight-950 inline-block rounded-xl border border-slate-200 dark:border-midnight-border text-slate-600 dark:text-slate-300 mt-2 transition-colors">
                          {book.category?.name || 'Uncategorized'}
                        </p>
                      </div>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {visibleCount < filteredResults.length && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleLoadMore}
                    className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-3 rounded-xl shadow-sm transition"
                  >
                    Load More
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Search;
