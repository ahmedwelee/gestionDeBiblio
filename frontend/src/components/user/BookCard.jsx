import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { getImageUrl } from '../../utils/imageHelper';

const BookCard = ({ book, index = 0, variant = 'default' }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.08,
        ease: 'easeOut',
        type: 'spring',
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 1 },
    hover: {
      scale: 1.08,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    hover: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  const renderGlassmorphismCard = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group h-full"
    >
      <Link to={`/book/${book.id}`} className="block h-full">
        <div className="glass-card h-full flex flex-col overflow-hidden border border-white/20 dark:border-midnight-border/40 hover:border-white/40 dark:hover:border-midnight-border/70 transition-all duration-300">
          {/* Image Container */}
          <motion.div
            variants={imageVariants}
            className="relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-midnight-border dark:to-midnight-950 h-64"
          >
            {book.image ? (
              <motion.img
                src={getImageUrl(book.image)}
                alt={book.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.4 }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-midnight-border dark:to-slate-800">
                <BookOpen className="w-16 h-16 text-slate-400 dark:text-midnight-border" />
              </div>
            )}

            {/* Overlay on hover - Enhanced */}
            <motion.div
              variants={overlayVariants}
              className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent flex items-end p-5 backdrop-blur-sm"
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                View Details
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Content */}
          <div className="flex-1 p-5 flex flex-col bg-white/50 dark:bg-midnight-card/50 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-midnight-text truncate mb-2 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300">
              {book.title}
            </h3>

            {book.author && (
              <p className="text-sm text-slate-600 dark:text-midnight-text-secondary mb-3 font-medium">
                by {book.author.name}
              </p>
            )}

            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 flex-grow opacity-90">
              {book.description}
            </p>

            {/* Footer Info */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-midnight-border/30">
              {book.price && (
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  ${book.price}
                </span>
              )}

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                  book.quantity > 0
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300 shadow-md dark:shadow-glow'
                    : 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 shadow-md'
                }`}
              >
                {book.quantity > 0 ? `${book.quantity} Available` : 'Out of Stock'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );

  const renderSimpleCard = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="group h-full stagger-item"
      whileHover="hover"
    >
      <Link to={`/book/${book.id}`} className="block h-full">
        <div className="glass-card h-full flex flex-col overflow-hidden border border-white/20 dark:border-midnight-border/40 hover:border-white/40 dark:hover:border-midnight-border/70 transition-all duration-300 shadow-card-float hover:shadow-card-float-hover">
          {/* Image */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            className="relative overflow-hidden h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-midnight-border dark:to-midnight-950"
          >
            {book.image ? (
              <img
                src={getImageUrl(book.image)}
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-midnight-border dark:to-slate-800">
                <BookOpen className="w-12 h-12 text-slate-400 dark:text-midnight-border" />
              </div>
            )}
          </motion.div>

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col bg-white/50 dark:bg-midnight-card/50 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-midnight-text mb-1 line-clamp-2 transition-colors duration-300">
              {book.title}
            </h3>

            {book.author && (
              <p className="text-xs text-slate-600 dark:text-midnight-text-secondary mb-2 font-medium">
                {book.author.name}
              </p>
            )}

            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 flex-grow mb-3 opacity-90">
              {book.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200/50 dark:border-midnight-border/30">
              {book.price && (
                <span className="text-primary-600 dark:text-primary-400 font-bold">
                  ${book.price}
                </span>
              )}
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full transition-all duration-300 ${
                  book.quantity > 0
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300'
                    : 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                }`}
              >
                {book.quantity > 0 ? 'Available' : 'Out'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );

  return variant === 'glass' ? renderGlassmorphismCard() : renderSimpleCard();
};

export default BookCard;

