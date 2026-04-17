/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axiosClient from "../../../../axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../../../context/UserContext";
import { format } from "date-fns";

function ReservationTableRow({ index, reservation, onDelete }) {
  const formatDate = (date) => {
    return format(new Date(date), "dd/MM/yy");
  };

  return (
    <tr className="bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border-b border-slate-200 dark:border-slate-600">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{index + 1}</td>
      <td className="text-sm text-slate-800 dark:text-slate-200 px-6 py-4 whitespace-nowrap">{reservation.user.name}</td>
      <td className="text-sm text-slate-800 dark:text-slate-200 px-6 py-4 whitespace-nowrap">{reservation.book.title}</td>
      <td className="text-sm text-slate-800 dark:text-slate-200 px-6 py-4 whitespace-nowrap">{reservation.borrow_days}</td>
      <td className="text-sm text-slate-800 dark:text-slate-200 px-6 py-4 whitespace-nowrap">{formatDate(reservation.reservation_Date)}</td>
      <td className="text-sm text-slate-800 dark:text-slate-200 px-6 py-4 whitespace-nowrap">{formatDate(reservation.expiryDate)}</td>
      <td className="text-sm font-medium text-right px-6 py-4 whitespace-nowrap">
        <div className="flex items-center justify-center">
          <button
            onClick={() => onDelete(reservation.id)}
            className="py-2 px-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-xl shadow-sm ml-2"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function ReservationUserTable() {
  const { user } = useUser();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReservations, setFilteredReservations] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get("message");
    if (message) {
      setSuccessMessage(message);
    }
  }, []);

  useEffect(() => {
     if (!user) return;
    setLoading(true);
    axiosClient
      .get(`/reservations/user/${user.id}`)
      .then((response) => {
        console.log("Reservations:", response.data);

        setReservations(response.data);
        setFilteredReservations(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reservations:", error);
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    const filtered = reservations.filter(({ user, book, borrow_days, reservation_Date, expiryDate }) =>
      (user.name ? user.name.toLowerCase() : '').includes(searchTerm.toLowerCase()) ||
      (book.title ? book.title.toLowerCase() : '').includes(searchTerm.toLowerCase()) ||
      (borrow_days ? borrow_days.toString().toLowerCase() : '').includes(searchTerm.toLowerCase()) ||
      (new Date(reservation_Date).toISOString().slice(0, 10) || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (new Date(expiryDate).toISOString().slice(0, 10) || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredReservations(filtered);
  }, [searchTerm, reservations]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (reservationId) => {
    if (window.confirm("Are you sure you want to delete this reservation?")) {
      axiosClient
        .delete(`/reservations/${reservationId}`)
        .then(() => {
          setReservations((prevReservations) => prevReservations.filter((reservation) => reservation.id !== reservationId));
          setSuccessMessage("Reservation deleted successfully.");
        })
        .catch((error) => {
          console.error("Error deleting reservation:", error);
          alert("Failed to delete reservation.");
        });
    }
  };

  const paginatedReservations = filteredReservations.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filteredReservations.length / perPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="spinner-border animate-spin inline-block w-8 h-8 border-b-2 border-blue-500 rounded-full"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4">
      {successMessage && (
        <div className="p-4 mb-6 text-primary-700 dark:text-primary-200 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700/50 rounded-lg font-medium" role="alert">
          ✓ {successMessage}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Reservations</h2>
        <p className="text-slate-600 dark:text-slate-400">Books you have reserved</p>
      </div>

      {filteredReservations.length > 0 && (
        <div className="bg-cyan-50 dark:bg-cyan-900/20 border-l-4 border-cyan-500 p-4 mb-6 rounded">
          <p className="text-cyan-700 dark:text-cyan-200 font-semibold">
            🔖 Total reservations: {filteredReservations.length}
          </p>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 mb-6 space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between flex-wrap">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full py-2 px-4 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Search by book title..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Show</span>
            <select
              value={perPage}
              onChange={(e) => setPerPage(parseInt(e.target.value))}
              className="py-2 px-3 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              className="py-2 px-4 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 dark:text-white transition-colors"
              disabled={page === 1}
            >
              ← Prev
            </button>
            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">
              {page} / {totalPages || 1}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              className="py-2 px-4 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 dark:text-white transition-colors"
              disabled={page === totalPages || totalPages === 0}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

        <div className="overflow-x-auto rounded-xl shadow-md">
            <table className="min-w-full table-auto rounded-xl overflow-hidden">
                <thead className="bg-slate-800 dark:bg-slate-900">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white dark:text-slate-200 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white dark:text-slate-200 uppercase tracking-wider">Book Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white dark:text-slate-200 uppercase tracking-wider">Borrow Days</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white dark:text-slate-200 uppercase tracking-wider">Reserved On</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white dark:text-slate-200 uppercase tracking-wider">Expires</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white dark:text-slate-200 uppercase tracking-wider">Actions</th>
                </tr>
                </thead>
                <tbody>
                {paginatedReservations.map((reservation, index) => (
                    <ReservationTableRow key={reservation.id} index={index} reservation={reservation} onDelete={handleDelete} />
                ))}
                </tbody>
            </table>
        </div>

      {filteredReservations.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📕</div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Reservations</h3>
          <p className="text-slate-600 dark:text-slate-400 text-lg">You haven't reserved any books yet</p>
        </div>
      )}


    </div>
  );
}
