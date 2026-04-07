import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from "../../../LibraryDashboard.module.css";

function CategoryTableRow({ index, category, onDelete }) {
  const navigate = useNavigate();
  return (
    <tr className={`${styles.tableRow} transition-all duration-200`}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200 transition-colors duration-500">{index + 1}</td>
      <td className="text-sm text-slate-900 dark:text-slate-300 font-light px-6 py-4 whitespace-nowrap transition-colors duration-500">{category.name}</td>
      <td className="text-sm text-slate-900 dark:text-slate-300 font-light px-6 py-4 whitespace-nowrap transition-colors duration-500">{category.description}</td>
      <td className="text-sm font-medium px-6 py-4 whitespace-nowrap">
        <div className={styles.actionButtons}>
        <button
          onClick={() => navigate(`/admin/dashboard/categories/edit/${category.id}`)}
            className={`${styles.actionButton} ${styles.editButton}`}
            title="Edit category"
        >
          <FontAwesomeIcon icon={faPencilAlt} />
        </button>
        <button
          onClick={() => onDelete(category.id)}
            className={`${styles.actionButton} ${styles.deleteButton}`}
            title="Delete category"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
        </div>
      </td>
    </tr>
  );
}

export function CategoryTable() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get("message");
    if (message) {
      setSuccessMessage(message);
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
    setLoading(true);
      try {
        const response = await axiosClient.get("/categories");
        setCategories(response.data);
        setFilteredCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(term.toLowerCase()) ||
        category.description.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCategories(filtered);
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await axiosClient.delete(`/categories/${id}`);
      setCategories(categories.filter((category) => category.id !== id));
      setFilteredCategories(filteredCategories.filter((category) => category.id !== id));
      setSuccessMessage("Category deleted successfully");
    } catch (error) {
          console.error("Error deleting category:", error);
    }
  };

  const paginatedCategories = filteredCategories.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filteredCategories.length / perPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-flex items-center gap-2 text-[#274e79]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
          <span className="text-lg font-medium">Loading categories...</span>
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
          Categories List
        </h2>
        <Link
          to="/admin/dashboard/categories/add"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#274e79] to-[#1a3b5c] text-white rounded-xl hover:from-[#1a3b5c] hover:to-[#274e79] transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Category
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
            placeholder="Search categories..."
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
              <th scope="col">Description</th>
              <th scope="col" className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedCategories.map((category, index) => (
              <CategoryTableRow
                key={category.id}
                index={(page - 1) * perPage + index}
                category={category}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

