/* eslint-disable react/prop-types */
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faBookOpen, faClock } from "@fortawesome/free-solid-svg-icons";

export default function ReserveBook({ userId }) {
  const { id } = useParams();
  const [dateTime, setDateTime] = useState("");
  const [book, setBook] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const bookImage = book.image_url || '../../../assets/website/image6.png';

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axiosClient.get(`/books/${id}`);
        setBook(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.post('/reservations', {
        reservation_time: dateTime,
        book_id: id,
        user_id: userId,
      });
      setSuccess(true);
      setError(null);
    } catch (error) {
      setError(error.message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-midnight-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
       <div className="max-w-4xl mx-auto">
         <div className="text-center mb-10">
           <h1 className="text-4xl font-semibold text-slate-900 dark:text-midnight-text mb-3 transition-colors duration-500">
             Reserve Your Copy
           </h1>
           <p className="text-slate-600 dark:text-slate-400 text-lg transition-colors duration-500">
             Secure your reading journey with our seamless reservation system
           </p>
         </div>

         <div className="bg-white dark:bg-midnight-card rounded-xl shadow-md dark:shadow-glass-lg overflow-hidden border border-slate-200 dark:border-midnight-border/30 transition-all duration-500">
           <div className="flex flex-col md:flex-row">
             <div className="md:w-1/2 relative">
               <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-slate-800/10 dark:from-primary-500/5 dark:to-slate-600/5 mix-blend-overlay" />
               <img
                 src={bookImage}
                 alt={book.title}
                 className="w-full h-full object-cover"
               />
             </div>

             <div className="md:w-1/2 p-8 bg-white dark:bg-midnight-card transition-colors duration-500">
               <div className="mb-8">
                 <h2 className="text-2xl font-semibold text-slate-900 dark:text-midnight-text mb-4 transition-colors duration-500">
                   <FontAwesomeIcon icon={faBookOpen} className="mr-3 text-primary-600 dark:text-primary-400" />
                   {book.title || 'Book Reservation'}
                 </h2>
                 <p className="text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-500">
                  Choose your preferred date and time to reserve this book. We will notify you once it is ready for pickup.
                </p>
          </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="relative">
                   <FontAwesomeIcon
                     icon={faCalendarAlt}
                     className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                   />
             <input
               type="datetime-local"
               value={dateTime}
               onChange={(e) => setDateTime(e.target.value)}
                     className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-midnight-border rounded-xl bg-white dark:bg-midnight-950 text-slate-900 dark:text-midnight-text focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-400 dark:focus:border-primary-500 transition duration-200"
               required
             />
                 </div>

             <button
               type="submit"
               disabled={loading}
                   className="w-full bg-primary-500 dark:bg-primary-600 text-white py-3 px-6 rounded-xl hover:bg-primary-600 dark:hover:bg-primary-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {loading ? (
                     <div className="flex items-center justify-center">
                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                       Processing...
                     </div>
                   ) : 'Confirm Reservation'}
             </button>
           </form>

               {success && (
                 <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-500/30 rounded-xl transition-all duration-500">
                   <p className="text-primary-700 dark:text-primary-400 transition-colors duration-500">Reservation successful! We will notify you soon.</p>
                 </div>
               )}

               {error && (
                 <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/30 rounded-xl transition-all duration-500">
                   <p className="text-red-700 dark:text-red-400 transition-colors duration-500">{error}</p>
                 </div>
               )}

               <div className="mt-6 flex items-center text-sm text-slate-500 dark:text-slate-400 transition-colors duration-500">
                 <FontAwesomeIcon icon={faClock} className="mr-2" />
                 <span>Time zone: Morocco GMT+08:00</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
