import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BannerImage from '../../../assets/website/image7.jpg';

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      className="relative bg-cover bg-center text-white h-[70vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${BannerImage})`,
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      {/* Enhanced overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/50" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-6 max-w-4xl"
      >
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl font-medium mb-4 text-slate-100 leading-relaxed drop-shadow-lg"
        >
          Your one-stop solution for reserving and borrowing books effortlessly.
          Experience a seamless library management system designed for both users and administrators.
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 drop-shadow-2xl"
          style={{
            textShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          <span className="text-blue-400">Welcome to</span> <span className="text-gradient-hero">Gestion Library</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-base md:text-lg text-slate-200 mb-10 max-w-2xl mx-auto drop-shadow-lg"
        >
          Discover thousands of books, manage your borrowed items, and enjoy a premium library experience.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/book"
            className="relative group"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center gap-2 group-hover:shadow-glow"
            >
              📚 Explore Books
            </motion.div>
          </Link>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#featured"
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border border-white/30"
          >
            Learn More ↓
          </motion.a>
        </motion.div>

        {/* Floating elements for visual interest */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -bottom-20 left-1/4 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute -top-20 right-1/4 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
