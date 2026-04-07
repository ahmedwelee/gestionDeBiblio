import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosClient from '../../../axiosClient';
import BookCard from '../BookCard';
import SkeletonLoader from '../SkeletonLoader';

const CategoryBooks = () => {
  const { categoryId } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState({});

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`/categories/${categoryId}/books`)
      .then((response) => {
        setCategory(response.data.category);
        setBooks(response.data.books);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des livres :', error);
        setLoading(false);
      });
  }, [categoryId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-midnight-950 dark:to-midnight-900 transition-colors duration-500 px-4 md:px-12 py-12">
      <motion.div variants={headerVariants} initial="hidden" animate="visible" className="mb-12">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent mb-4 text-center">
          📚 {category.name}
        </h1>
        <p className="text-center text-slate-600 dark:text-slate-400 text-lg">
          Explore our curated collection of {category.name} titles
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
          className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
        >
          {books.map((book, index) => (
            <BookCard key={book.id} book={book} index={index} variant="glass" />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <p className="text-2xl text-slate-600 dark:text-slate-400 mb-4">
            📭 Aucun livre trouvé pour cette catégorie.
          </p>
          <p className="text-slate-500 dark:text-slate-500">
            Revenez bientôt pour découvrir de nouveaux livres!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default CategoryBooks;
