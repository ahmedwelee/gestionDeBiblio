/* eslint-disable react/prop-types */
import { useState } from 'react';
import { format } from 'date-fns';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faBook, faCalendar, faClock, faCoins, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";

const ReservationForm = ({ price, bookName, reservationDate, expiryDate, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const borrowDays = Math.ceil((new Date(expiryDate) - new Date(reservationDate)) / (1000 * 60 * 60 * 24));
  const total = price * borrowDays;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden m-4">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-slate-900 mb-3">
              Confirm Your Reservation
            </h1>
            <p className="text-slate-600">
              Review your reservation details and complete the payment
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
                <FontAwesomeIcon icon={faBook} className="mr-3 text-primary-600" />
                Reservation Details
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center text-slate-700">
                    <FontAwesomeIcon icon={faBook} className="mr-3 text-primary-600" />
                    <span>Book Name</span>
                  </div>
                  <span className="font-medium">{bookName}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center text-slate-700">
                    <FontAwesomeIcon icon={faCalendar} className="mr-3 text-primary-600" />
                    <span>Reservation Date</span>
                  </div>
                  <span className="font-medium">{format(new Date(reservationDate), 'PP')}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center text-slate-700">
                    <FontAwesomeIcon icon={faClock} className="mr-3 text-primary-600" />
                    <span>Expiry Date</span>
                  </div>
                  <span className="font-medium">{format(new Date(expiryDate), 'PP')}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center text-slate-700">
                    <FontAwesomeIcon icon={faClock} className="mr-3 text-primary-600" />
                    <span>Duration</span>
                  </div>
                  <span className="font-medium">{borrowDays} days</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center text-slate-700">
                    <FontAwesomeIcon icon={faCoins} className="mr-3 text-primary-600" />
                    <span>Daily Price</span>
                  </div>
                  <span className="font-medium">{price} Dhs</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-primary-500 rounded-xl text-white">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faCoins} className="mr-3" />
                    <span>Total Cost</span>
                  </div>
                  <span className="font-bold text-xl">{total} Dhs</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
                <FontAwesomeIcon icon={faCreditCard} className="mr-3 text-primary-600" />
                Payment Information
              </h3>

              <div className="space-y-4">
                <div className="relative">
          <input
            type="text"
            placeholder="Card Number"
                    className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition duration-200"
            required
          />
                </div>

                <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Expiration (MM/YY)"
                    className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition duration-200"
            required
          />
          <input
            type="text"
            placeholder="CVV"
                    className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition duration-200"
            required
          />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-500 text-white py-4 px-6 rounded-xl hover:bg-primary-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Confirm Payment'
                  )}
                </button>
        </div>
      </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;
