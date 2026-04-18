import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaBook, FaSpinner, FaTimes } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import BooksByCategory from './BooksByCategory';
import { useUser } from '../../../context/UserContext';
import ReservationForm from './ConfirmReservation';
import axiosClient from '../../../axiosClient';
import { getImageUrl } from '../../../utils/imageHelper';
import moment from 'moment';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomStyle, setZoomStyle] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [reservationDate, setReservationDate] = useState(moment().format('YYYY-MM-DD'));
  const [expiryDate, setExpiryDate] = useState(moment().add(10, 'days').format('YYYY-MM-DD'));
  const [reservationLoading, setReservationLoading] = useState(false);
  const [isWaitingListOpen, setIsWaitingListOpen] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axiosClient.get(`/books/${id}`);
        const book = response.data;
        setBook(book);
        if (book.quantity <= 0) {
          setIsWaitingListOpen(true);
        }
      } catch (err) {
        setError('Error loading book');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleReserve = () => {
    if (book.quantity <= 0) {
      toast.error('This book is currently unavailable for reservation.');
      setIsWaitingListOpen(true);
      return;
    }

    if (!user) {
      localStorage.setItem('returnTo', location.pathname);
      toast.info('Please log in to reserve a book. Redirecting to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    setIsReservationModalOpen(true);
  };

  const handleJoinWaitingList = async () => {
    if (!user) {
      localStorage.setItem('returnTo', location.pathname);
      toast.info('Please log in to join the waiting list. Redirecting to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    try {
      await axiosClient.post('/waitingList/create', {
        user_id: user.id,
        book_id: book.id,
      });

      toast.success('You have been added to the waiting list.');
      setIsWaitingListOpen(false);
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleMouseEnter = (e) => {
    const zoomBox = e.target.getBoundingClientRect();
    const centerX = e.clientX - zoomBox.left;
    const centerY = e.clientY - zoomBox.top;

    setZoomStyle({
      backgroundImage: `url(${e.target.src})`,
      backgroundPosition: `${(centerX / zoomBox.width) * 100}% ${(centerY / zoomBox.height) * 100}%`,
      backgroundSize: `${zoomBox.width * 2}px ${zoomBox.height * 2}px`,
      cursor: 'zoom-in',
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle(null);
  };

  const openImageModal = () => {
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const closeReservationModal = () => {
    setIsReservationModalOpen(false);
  };

  const handleConfirmReservation = async () => {
    try {
      setReservationLoading(true);
      await axiosClient.post('/reservations/create', {
        user_id: user.id,
        book_id: book.id,
        reservation_Date: reservationDate,
        expiryDate: expiryDate,
      });

      setBook((prev) => {
        const newQuantity = prev.quantity - 1;
        if (newQuantity <= 0) {
          setIsWaitingListOpen(true);
        }
        return { ...prev, quantity: newQuantity };
      });

      toast.success(`Reservation successful!`);

      closeReservationModal();
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setReservationLoading(false);
    }
  };

   if (loading) return (
     <div className="text-center py-10 text-lg text-slate-600 dark:text-slate-400 transition-colors duration-500">
       <FaSpinner className="animate-spin text-4xl text-primary-500 dark:text-primary-400 mx-auto" />
     </div>
   );

   if (error) return <div className="text-center py-10 text-red-500 dark:text-red-400 transition-colors duration-500">Error: {error}</div>;
   if (!book) return <div className="text-center py-10 text-slate-600 dark:text-slate-400 transition-colors duration-500">Book not found.</div>;

  const bookInfo = [
    { label: 'Title', value: book.title },
    { label: 'Author', value: book.author?.name },
    { label: 'Category', value: book.category?.name },
    { label: 'Price', value: `${book.price} Dhs/day` },
    { label: 'Quantity', value: book.quantity },
  ];

   return (
     <motion.div
       initial={{ opacity: 0, y: 30 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.6 }}
       className="max-w-5xl mx-auto p-6 md:p-10 bg-gradient-to-br from-white via-slate-50 to-white dark:from-midnight-950 dark:via-midnight-card dark:to-midnight-950 shadow-xl dark:shadow-glass-lg rounded-3xl mt-10 border border-slate-200 dark:border-midnight-border/30 transition-all duration-500"
     >
       <div className="flex flex-col md:flex-row items-center md:space-x-10">
         <motion.div
           initial={{ scale: 0.9 }}
           animate={{ scale: 1 }}
           transition={{ duration: 0.5 }}
           className="w-full md:w-1/3 relative overflow-hidden cursor-pointer"
         >
            {book.image && (
              <img
                src={getImageUrl(book.image)}
                alt={book.title}
                className="w-full h-80 object-cover rounded-2xl shadow-lg transition-all duration-300"
                onMouseMove={handleMouseEnter}
               onMouseLeave={handleMouseLeave}
               onClick={openImageModal}
             />
           )}
           {zoomStyle && (
             <div
               className="absolute inset-0 bg-black opacity-50"
               style={{
                 ...zoomStyle,
                 position: 'absolute',
                 top: 0,
                 left: 0,
                 zIndex: 10,
                 pointerEvents: 'none',
               }}
             />
           )}
         </motion.div>

         <div className="w-full md:w-2/3 mt-6 md:mt-0">
           <h1 className="text-4xl font-extrabold text-primary-700 dark:text-primary-400 mb-4 tracking-wide transition-colors duration-500">{book.title}</h1>

           <ul className="text-lg text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-500">
             {bookInfo.map(({ label, value }) => (
               <li key={label} className="flex items-center space-x-2">
                 <span className="font-semibold text-primary-700 dark:text-primary-400 transition-colors duration-500">{label}</span>
                 <span className="text-slate-600 dark:text-slate-400 transition-colors duration-500">{value}</span>
               </li>
             ))}
           </ul>

           <p className="text-base text-slate-600 dark:text-slate-400 mb-6 bg-white dark:bg-midnight-950/50 bg-opacity-60 p-3 rounded-xl shadow-inner dark:shadow-glass-sm transition-all duration-500">
             <span className="font-semibold text-primary-700 dark:text-primary-400 transition-colors duration-500">Description:</span> {book.description}
           </p>

           <div className="flex items-center space-x-4 mb-4">
             <label htmlFor="reservation-date" className="text-lg font-semibold text-primary-700 dark:text-primary-400 transition-colors duration-500">
               Desired Reservation Date:
             </label>
             <input
               type="date"
               id="reservation-date"
               value={reservationDate}
               onChange={(e) => setReservationDate(e.target.value)}
               className="px-4 py-2 border border-slate-300 dark:border-midnight-border rounded-lg bg-white dark:bg-midnight-950 text-slate-900 dark:text-midnight-text transition-all duration-500"
             />
           </div>

           <div className="flex items-center space-x-4 mb-6">
             <label htmlFor="expiry-date" className="text-lg font-semibold text-primary-700 dark:text-primary-400 transition-colors duration-500">
               Reservation Expiry Date:
             </label>
             <input
               type="date"
               id="expiry-date"
               value={expiryDate}
               onChange={(e) => setExpiryDate(e.target.value)}
               className="px-4 py-2 border border-slate-300 dark:border-midnight-border rounded-lg bg-white dark:bg-midnight-950 text-slate-900 dark:text-midnight-text transition-all duration-500"
             />
           </div>

           <motion.button
             whileTap={{ scale: 0.95 }}
             whileHover={{ scale: 1.05 }}
             onClick={handleReserve}
             disabled={book.quantity <= 0}
            className={`py-3 px-8 rounded-full font-bold shadow-lg transition-all duration-300 text-white ${
              book.quantity > 0
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            {book.quantity > 0 ? "Reserve Now 📘" : "Already Reserved ❌"}
          </motion.button>
          {book.quantity <= 0 && isWaitingListOpen && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleJoinWaitingList}
              className="py-3 px-8 rounded-full font-bold shadow-lg transition-all duration-300 text-white bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 mt-4"
            >
              Join Waiting List
            </motion.button>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">Other Books in the Same Category</h2>
        <BooksByCategory categoryId={book.category_id} bookId={book.id} />
      </div>
      <ToastContainer />
      {isImageModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
           <div className="relative">
             <img
               src={getImageUrl(book.image)}
               alt={book.title}
               className="w-full h-auto max-w-lg rounded-lg shadow-lg"
             />
            <button
              onClick={closeImageModal}
              className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-2 hover:bg-red-600 transition duration-300"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
      {isReservationModalOpen && (
            <ReservationForm
              price={book.price}
              bookName={book.title}
              reservationDate={reservationDate}
              expiryDate={expiryDate}
          onClose={closeReservationModal}
          onConfirm={handleConfirmReservation}
        />
      )}
    </motion.div>
  );
}

export default BookDetail;


