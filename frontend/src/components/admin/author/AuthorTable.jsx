import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from "../../../LibraryDashboard.module.css";

function AuthorTableRow({ index, author, onDelete }) {
  const navigate = useNavigate();
  return (
    <tr className={`${styles.tableRow} transition-all duration-200`}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200 transition-colors duration-500">{index + 1}</td>
      <td className="text-sm text-slate-900 dark:text-slate-300 font-light px-6 py-4 whitespace-nowrap transition-colors duration-500">{author.name}</td>
      <td className="text-sm text-slate-900 dark:text-slate-300 font-light px-6 py-4 whitespace-nowrap transition-colors duration-500">{author.piography}</td>
      <td className="text-sm font-medium px-6 py-4 whitespace-nowrap">
        <div className={styles.actionButtons}>
        <button
          onClick={() => navigate(`/admin/dashboard/authors/edit/${author.id}`)}
            className={`${styles.actionButton} ${styles.editButton}`}
            title="Edit author"
        >
          <FontAwesomeIcon icon={faPencilAlt} />
        </button>
        <button
          onClick={() => onDelete(author.id)}
            className={`${styles.actionButton} ${styles.deleteButton}`}
            title="Delete author"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
        </div>
      </td>
    </tr>
  );
}

export function AuthorTable() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAuthors, setFilteredAuthors] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get("message");
    if (message) {
      setSuccessMessage(message);
    }
  }, []);

  useEffect(() => {
    const fetchAuthors = async () => {
    setLoading(true);
      try {
        const response = await axiosClient.get("/authors");
        setAuthors(response.data);
        setFilteredAuthors(response.data);
      } catch (error) {
        console.error("Error fetching authors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = authors.filter(
      (author) =>
        author.name.toLowerCase().includes(term.toLowerCase()) ||
        author.piography.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredAuthors(filtered);
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this author?")) {
      return;
    }

    try {
      await axiosClient.delete(`/authors/${id}`);
      setAuthors(authors.filter((author) => author.id !== id));
      setFilteredAuthors(filteredAuthors.filter((author) => author.id !== id));
      setSuccessMessage("Author deleted successfully");
    } catch (error) {
          console.error("Error deleting author:", error);
    }
  };

  const paginatedAuthors = filteredAuthors.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filteredAuthors.length / perPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-flex items-center gap-2 text-[#274e79]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
          <span className="text-lg font-medium">Loading authors...</span>
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
          Authors List
        </h2>
        <Link
          to="/admin/dashboard/authors/add"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#274e79] to-[#1a3b5c] text-white rounded-xl hover:from-[#1a3b5c] hover:to-[#274e79] transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Author
        </Link>
      </div>

      <div className={styles.tableControls}>
        <div className="relative">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className={`${styles.searchInput} pl-10`}
            placeholder="Search authors..."
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
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Biography</th>
              <th scope="col" className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedAuthors.map((author, index) => (
              <AuthorTableRow
                key={author.id}
                index={(page - 1) * perPage + index}
                author={author}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

