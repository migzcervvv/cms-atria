// CategoryForm.js
import React, { useState } from "react";

function CategoryForm({ fetchCategories }) {
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/categories/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category }),
      });
      if (!response.ok) {
        throw new Error("Failed to create category");
      }
      fetchCategories();
      setCategory("");
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        placeholder="Enter category name"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border border-gray-800 px-4 py-2 mr-2"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Create Category
      </button>
    </form>
  );
}

export default CategoryForm;
