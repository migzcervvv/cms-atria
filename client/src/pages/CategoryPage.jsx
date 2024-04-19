import React, { useState, useEffect } from "react";
import CategoryForm from "../components/CategoryForm";
import CategoryEdit from "../components/CategoryEdit";

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [editCategory, setEditCategory] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories/get");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/categories/delete/${id}`, { method: "DELETE" });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleEdit = async (id) => {
    try {
      // Fetch the category data for the given ID
      const response = await fetch(`/api/categories/get/${id}`);
      const categoryData = await response.json();

      // Set editCategory to the fetched category data
      setEditCategory(categoryData);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  if (!categories || categories.length === 0) {
    return <p>No categories found.</p>;
  }

  return (
    <div className="flex flex-row items-start justify-center min-h-screen w-full">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold mb-4">Categories</h1>
        {/* Render CategoryForm or CategoryEdit based on editCategory state */}
        {editCategory ? (
          <CategoryEdit
            fetchCategories={fetchCategories}
            category={editCategory}
          />
        ) : (
          <CategoryForm fetchCategories={fetchCategories} />
        )}
        <table
          className="w-full table-auto border-collapse border border-gray-800"
          categories={categories}
        >
          <thead>
            <tr>
              <th className="border border-gray-800 px-4 py-2">
                Category Name
              </th>
              <th className="border border-gray-800 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td className="border border-gray-800 px-4 py-2">
                  {category.category}
                </td>
                <td className="border border-gray-800 px-4 py-2">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleDelete(category._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-amber-300 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleEdit(category)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CategoryPage;
