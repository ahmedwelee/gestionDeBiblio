import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axiosClient from '../../../axiosClient';
import BookCard from '../BookCard';
import SkeletonLoader from '../SkeletonLoader';

const NewArrivals = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axiosClient.get("/books/newArrivals");
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white dark:from-midnight-900 dark:to-midnight-950 py-16 px-4 md:px-12 transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent mb-4">
          ✨ New Arrivals
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Stay updated with the latest additions to our collection. Discover fresh titles curated just for you.
        </p>
      </motion.div>

      {loading ? (
        <div className="max-w-7xl mx-auto">
          <SkeletonLoader count={6} variant="card" />
        </div>
      ) : books.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
        >
          {books.map((book, index) => (
            <BookCard key={book.id} book={book} index={index} variant="glass" />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-4">
            📭 No new arrivals yet.
          </p>
          <p className="text-slate-500 dark:text-slate-500">Check back soon for exciting new books!</p>
        </motion.div>
      )}
    </section>
  );
};

export default NewArrivals;

