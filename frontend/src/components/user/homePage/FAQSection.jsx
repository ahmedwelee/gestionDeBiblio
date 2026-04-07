import React, { useState } from 'react';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqItems = [
    {
      question: 'How do I borrow a book?',
      answer: "To borrow a book, simply browse our catalog, select the book you wish to borrow, and click the 'Reserve' button. You'll receive a confirmation once your request is processed.",
    },
    {
      question: 'What if I want to return a book?',
      answer: 'Returning a book is just as easy. Navigate to your user dashboard, find the book you wish to return, and click on the "Return" option. Ensure to return it by the due date to avoid late fees.',
    },
    {
      question: 'Can I extend my borrowing period?',
      answer: 'Yes, you can request an extension on your borrowing period. Go to your dashboard, select the book, and choose the "Request Extension" option. Subject to availability, your request will be processed promptly.',
    },
  ];

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="py-12 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-midnight-950 dark:to-slate-900 transition-colors duration-500">
      <h2 className="text-3xl font-serif font-bold text-center mb-4 text-slate-900 dark:text-midnight-text transition-colors duration-500">How It Works?</h2>
      <p className="font-serif text-center mb-8 text-slate-600 dark:text-slate-400 transition-colors duration-500">
        Understanding the borrowing process is essential for a seamless experience. Here's how you can easily borrow and return books at Gestion Library Advanced.
      </p>
      <div className="max-w-4xl mx-auto">
        {faqItems.map((item, index) => (
          <div key={index} className="mb-4 shadow-md dark:shadow-glass-lg rounded-md overflow-hidden transition-all duration-500">
            <div
              onClick={() => toggleAnswer(index)}
              className="bg-slate-900 dark:bg-midnight-card text-white flex justify-between items-center cursor-pointer p-4 hover:bg-slate-800 dark:hover:bg-midnight-border/50 transition-colors duration-500"
            >
              <h3 className="font-serif font-semibold text-lg text-white dark:text-midnight-text transition-colors duration-500">{item.question}</h3>
              <span
                className={`text-slate-400 dark:text-slate-500 text-xl transform transition-transform duration-300 ${
                  activeIndex === index ? 'rotate-180' : ''
                }`}
              >
                ▼
              </span>
            </div>
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                activeIndex === index ? 'max-h-96 opacity-100 p-4' : 'max-h-0 opacity-0 p-0'
              } bg-white dark:bg-midnight-950 text-slate-800 dark:text-slate-300 border-t border-slate-200 dark:border-midnight-border/30 font-serif transition-colors duration-500`}
            >
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;