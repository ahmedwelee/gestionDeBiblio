import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 6, variant = 'card' }) => {
  const skeletonVariants = {
    animate: {
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  if (variant === 'list') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {Array(count)
          .fill(0)
          .map((_, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="flex gap-4 p-4 bg-white dark:bg-midnight-card rounded-xl border border-slate-200 dark:border-midnight-border/30 shadow-sm dark:shadow-glass-sm"
            >
              <motion.div
                variants={skeletonVariants}
                animate="animate"
                className="w-20 h-20 skeleton rounded-lg flex-shrink-0"
              />
              <div className="flex-1 space-y-3">
                <motion.div
                  variants={skeletonVariants}
                  animate="animate"
                  className="h-4 skeleton w-3/4 rounded-lg"
                />
                <motion.div
                  variants={skeletonVariants}
                  animate="animate"
                  className="h-3 skeleton w-1/2 rounded-lg"
                />
                <motion.div
                  variants={skeletonVariants}
                  animate="animate"
                  className="h-3 skeleton w-2/3 rounded-lg"
                />
              </div>
            </motion.div>
          ))}
      </motion.div>
    );
  }

  // Grid variant (default) - Premium glassmorphism skeleton
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="glass-card overflow-hidden border border-white/20 dark:border-midnight-border/40 shadow-card-float dark:shadow-glass-lg"
          >
            {/* Image skeleton */}
            <motion.div
              variants={skeletonVariants}
              animate="animate"
              className="w-full h-64 skeleton rounded-none"
            />
            
            {/* Content skeleton */}
            <div className="p-5 space-y-4">
              {/* Title skeleton */}
              <motion.div
                variants={skeletonVariants}
                animate="animate"
                className="h-6 skeleton w-4/5 rounded-lg"
              />
              
              {/* Author skeleton */}
              <motion.div
                variants={skeletonVariants}
                animate="animate"
                className="h-3 skeleton w-1/2 rounded-lg"
              />
              
              {/* Description skeleton lines */}
              <div className="space-y-2">
                <motion.div
                  variants={skeletonVariants}
                  animate="animate"
                  className="h-3 skeleton w-full rounded-lg"
                />
                <motion.div
                  variants={skeletonVariants}
                  animate="animate"
                  className="h-3 skeleton w-4/5 rounded-lg"
                />
              </div>
              
              {/* Footer skeleton */}
              <div className="flex gap-3 pt-3 border-t border-slate-200/50 dark:border-midnight-border/20">
                <motion.div
                  variants={skeletonVariants}
                  animate="animate"
                  className="h-8 skeleton flex-1 rounded-lg"
                />
                <motion.div
                  variants={skeletonVariants}
                  animate="animate"
                  className="h-8 skeleton w-1/3 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        ))}
    </motion.div>
  );
};

export default SkeletonLoader;

