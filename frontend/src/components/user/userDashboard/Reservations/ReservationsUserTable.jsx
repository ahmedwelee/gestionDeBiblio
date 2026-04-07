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
    <tr className="bg-white hover:bg-slate-50 border-b border-slate-200">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{index + 1}</td>
      <td className="text-sm text-slate-800 px-6 py-4 whitespace-nowrap">{reservation.user.name}</td>
      <td className="text-sm text-slate-800 px-6 py-4 whitespace-nowrap">{reservation.book.title}</td>
      <td className="text-sm text-slate-800 px-6 py-4 whitespace-nowrap">{reservation.borrow_days}</td>
      <td className="text-sm text-slate-800 px-6 py-4 whitespace-nowrap">{formatDate(reservation.reservation_Date)}</td>
      <td className="text-sm text-slate-800 px-6 py-4 whitespace-nowrap">{formatDate(reservation.expiryDate)}</td>
      <td className="text-sm font-medium text-right px-6 py-4 whitespace-nowrap">
        <div className="flex items-center justify-center">
          <button
            onClick={() => onDelete(reservation.id)}
            className="py-2 px-3 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl shadow-sm ml-2"
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
        <div className="p-4 mb-4 text-primary-700 bg-primary-50 border border-primary-200 rounded-xl" role="alert">
          <p>{successMessage}</p>
        </div>
      )}
      <div className="flex justify-between items-center py-4">
        <h2 className="text-2xl font-semibold text-slate-900">My Reservations List</h2>
      </div>
      <div className="flex items-center justify-between py-4 gap-4 flex-wrap">
        <div className="space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="py-2 px-4 border border-slate-200 rounded-xl shadow-sm"
            placeholder="Search..."
          />
        </div>
        <div className="space-x-2">
          <span className="text-sm text-slate-600">Show</span>
          <select
            value={perPage}
            onChange={(e) => setPerPage(parseInt(e.target.value))}
            className="py-2 px-4 border border-slate-200 rounded-xl shadow-sm"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            className="py-2 px-4 border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 disabled:opacity-50"
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-sm text-slate-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            className="py-2 px-4 border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 disabled:opacity-50"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-sm">
        <table className="min-w-full table-auto rounded-xl overflow-hidden">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">User Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Book Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Borrow Days</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Reservation Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Expiry Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReservations.map((reservation, index) => (
              <ReservationTableRow key={reservation.id} index={index} reservation={reservation} onDelete={handleDelete} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
