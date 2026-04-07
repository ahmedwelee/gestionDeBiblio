import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axiosClient from '../../../axiosClient';
import BookCard from '../BookCard';
import SkeletonLoader from '../SkeletonLoader';

const FeaturedReads = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axiosClient.get('/books');
        // Take only the first 3 books
        setBooks(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching books:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (error) {
    return (
      <div className="text-center py-20 text-red-500 font-semibold text-lg">
        ❌ Error: {error}
      </div>
    );
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut', type: 'spring', stiffness: 80 },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section id="featured" className="bg-gradient-to-b from-white via-slate-50 to-white dark:from-midnight-950 dark:via-slate-900 dark:to-midnight-950 py-20 px-6 md:px-12 transition-colors duration-500 relative overflow-hidden">
      {/* Background elements */}
      <motion.div
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-10 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute -bottom-10 left-0 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative z-10">
        {/* Header Section */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-lg">✨</span>
            <span className="font-semibold text-sm">Handpicked Selection</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent mb-6">
            Featured Reads
          </h2>

          <motion.p
            variants={subtitleVariants}
            className="text-lg max-w-3xl mx-auto text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            Explore our carefully curated selection of popular books that are currently available for borrowing.
            These titles have been handpicked based on their popularity and exceptional user ratings.
          </motion.p>
        </motion.div>

        {/* Books Grid */}
        {loading ? (
          <div className="max-w-7xl mx-auto">
            <SkeletonLoader count={3} variant="card" />
          </div>
        ) : books.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          >
            {books.map((book, index) => (
              <motion.div
                key={book.id}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <BookCard book={book} index={index} variant="glass" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <p className="text-xl text-slate-600 dark:text-slate-400">
              📭 No featured reads available at the moment.
            </p>
          </motion.div>
        )}

        {/* CTA Section */}
        {books.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-16"
          >
            <a
              href="/book"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              Browse All Books
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedReads;