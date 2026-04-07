import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import image4 from '../../../assets/website/image4.png';
import image5 from '../../../assets/website/image5.png';
import image6 from '../../../assets/website/image6.png';

const CarouselSection = () => {
  const items = [
    {
      image: image4,
      title: 'Easy Book Reservations',
      description:
        'Reserve your favorite books with just a few clicks. Our user-friendly interface allows you to browse through our extensive catalog and secure your selections in no time.',
      buttonLabel: 'Reserve Now',
      link: './ReservePage',
    },
    {
      image: image5,
      title: 'Robust Admin Tools',
      description:
        "For administrators, we provide powerful tools to manage books, users, and borrow requests efficiently. Take control of your library's operations with ease.",
      buttonLabel: 'Admin Login',
      link: '/admin-login',
    },
    {
      image: image6,
      title: 'Comprehensive User Dashboard',
      description:
        'Manage your profile, view your borrowing history, and monitor your requests from a centralized dashboard. Everything you need is just a login away.',
      buttonLabel: 'View Dashboard',
      link: '/dashboard',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="relative w-full flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-r from-slate-50 to-white dark:from-midnight-950 dark:to-slate-900 font-serif transition-colors duration-500">
      <div className="w-full max-w-5xl relative overflow-hidden rounded-2xl shadow-xl dark:shadow-glass-lg bg-white dark:bg-midnight-card flex flex-col md:flex-row border border-slate-200 dark:border-midnight-border/30 transition-all duration-500">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 h-64 md:h-auto"
          >
            <img
              src={items[currentIndex].image}
              alt={items[currentIndex].title}
              className="w-full h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-t-none"
            />
          </motion.div>
        </AnimatePresence>

        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
          <motion.h2
            key={`title-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-midnight-text mb-3 transition-colors duration-500"
          >
            {items[currentIndex].title}
          </motion.h2>
          <motion.p
            key={`desc-${currentIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-slate-600 dark:text-slate-400 mb-6 transition-colors duration-500"
          >
            {items[currentIndex].description}
          </motion.p>
          <Link
            to={items[currentIndex].link}
            className="self-start bg-slate-900 dark:bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-slate-800 dark:hover:bg-primary-500 transition duration-300"
          >
            {items[currentIndex].buttonLabel}
          </Link>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-midnight-card border border-slate-300 dark:border-midnight-border hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-midnight-text text-xl p-2 rounded-full shadow-md dark:shadow-glass-sm z-10 transition-all duration-300"
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-midnight-card border border-slate-300 dark:border-midnight-border hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-midnight-text text-xl p-2 rounded-full shadow-md dark:shadow-glass-sm z-10 transition-all duration-300"
        >
          ❯
        </button>
      </div>

      <div className="flex space-x-3 mt-6">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              i === currentIndex ? 'bg-slate-900 dark:bg-primary-500 scale-125' : 'bg-slate-400 dark:bg-slate-600'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default CarouselSection;