import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from "../../../LibraryDashboard.module.css";
import { format } from "date-fns";

function ReservationTableRow({ index, reservation, onDelete, onApprove }) {
  const navigate = useNavigate();
  
  const formatDate = (date) => {
    return format(new Date(date), "dd/MM/yy");
  };

  return (
    <tr className={`${styles.tableRow} transition-all duration-200`}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200 transition-colors duration-500">{index + 1}</td>
      <td className="text-sm text-slate-900 dark:text-slate-300 font-light px-6 py-4 whitespace-nowrap transition-colors duration-500">{reservation.user.name}</td>
      <td className="text-sm text-slate-900 dark:text-slate-300 font-light px-6 py-4 whitespace-nowrap transition-colors duration-500">{reservation.book.title}</td>
      <td className="text-sm text-slate-900 dark:text-slate-300 font-light px-6 py-4 whitespace-nowrap transition-colors duration-500">{reservation.borrow_days}</td>
      <td className="text-sm text-slate-900 dark:text-slate-300 font-light px-6 py-4 whitespace-nowrap transition-colors duration-500">{formatDate(reservation.reservation_Date)}</td>
      <td className="text-sm text-slate-900 dark:text-slate-300 font-light px-6 py-4 whitespace-nowrap transition-colors duration-500">{formatDate(reservation.expiryDate)}</td>
      <td className="text-sm font-medium text-right px-6 py-4 whitespace-nowrap">
        <div className="flex items-center justify-center">
          <button
            onClick={() => onApprove(reservation.id)}
            className="py-1 px-2 text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 bg-green-100 dark:bg-green-950/40 hover:bg-green-200 dark:hover:bg-green-900/50 border border-green-600 dark:border-green-500/50 rounded-md shadow-sm dark:shadow-glass-sm transition-all duration-300"
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
          <button
            onClick={() => onDelete(reservation.id)}
            className="py-1 px-2 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 bg-red-100 dark:bg-red-950/40 hover:bg-red-200 dark:hover:bg-red-900/50 border border-red-600 dark:border-red-500/50 rounded-md shadow-sm dark:shadow-glass-sm ml-2 transition-all duration-300"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function ReservationTable() {
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
    setLoading(true);
    axiosClient
      .get(`/reservations`)
      .then((response) => {
        setReservations(response.data);
        setFilteredReservations(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reservations:", error);
        setLoading(false);
      });
  }, []);

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

const handleApprove = (reservationId) => {
  axiosClient
    .post(`/reservations/approve/${reservationId}`)
    .then(() => {
      setReservations((prevReservations) =>
        prevReservations.filter((reservation) => reservation.id !== reservationId)
      );
      setSuccessMessage("Reservation approved successfully.");
    })
    .catch((error) => {
      console.error("Error approving reservation:", error);
      alert("Failed to approve reservation.");
    });
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
    <div className={styles.tableContainer}>
      {successMessage && (
        <div className="mb-4 p-4 rounded-lg bg-green-50 border-l-4 border-green-400">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#274e79] to-[#1a3b5c] bg-clip-text text-transparent">
          Reservations List
        </h2>
      </div>

      <div className={styles.tableControls}>
        <div className="relative">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className={`${styles.searchInput} pl-10`}
            placeholder="Search reservations..."
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Show</span>
          <select
            value={perPage}
            onChange={(e) => setPerPage(parseInt(e.target.value))}
              className={styles.pageButton}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
          
          <div className={styles.pageControls}>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
              className={styles.pageButton}
          >
            Previous
          </button>
            <span className="text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
              className={styles.pageButton}
          >
            Next
          </button>
        </div>
      </div>
      </div>

      <div className="overflow-x-auto rounded-xl">
        <table className={styles.table}>
          <thead className="bg-gradient-to-r from-[#274e79] to-[#1a3b5c] text-white">
            <tr>
              <th scope="col" className="px-6 py-4 border-r border-white/10 font-semibold text-sm uppercase">#</th>
              <th scope="col" className="px-6 py-4 border-r border-white/10 font-semibold text-sm uppercase">User Name</th>
              <th scope="col" className="px-6 py-4 border-r border-white/10 font-semibold text-sm uppercase">Book Name</th>
              <th scope="col" className="px-6 py-4 border-r border-white/10 font-semibold text-sm uppercase">Borrow Days</th>
              <th scope="col" className="px-6 py-4 border-r border-white/10 font-semibold text-sm uppercase">Reservation Date</th>
              <th scope="col" className="px-6 py-4 border-r border-white/10 font-semibold text-sm uppercase">Expiry Date</th>
              <th scope="col" className="px-6 py-4 font-semibold text-sm uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedReservations.map((reservation, index) => (
              <ReservationTableRow
                key={reservation.id}
                index={(page - 1) * perPage + index}
                reservation={reservation}
                onDelete={handleDelete}
                onApprove={handleApprove}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

