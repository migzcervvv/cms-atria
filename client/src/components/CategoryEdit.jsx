import React, { useState, useEffect } from "react";

function CategoryEdit({ fetchCategories, editCategory }) {
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (editCategory) {
      setCategoryName(editCategory.category);
    }
  }, [editCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCategory) {
        // Perform update operation if editCategory is defined
        await fetch(`/api/categories/update/${editCategory._id}`, {
          method: "PUT", // Specify the method as PUT for update
          headers: {
            "Content-Type": "application/json", // Specify the content type
          },
          body: JSON.stringify({ category: categoryName }), // Convert the body to JSON
        });
        console.log(editCategory._id);
        fetchCategories();
        setCategoryName("");
      } else {
        console.log("Error updating this category"); // Fixed the error message here
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        placeholder="Enter category name"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        className="border border-gray-800 px-4 py-2 mr-2"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Update Category
      </button>
    </form>
  );
}

export default CategoryEdit;
