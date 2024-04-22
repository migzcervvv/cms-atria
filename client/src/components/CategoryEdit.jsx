import { useState, useEffect } from "react";

function CategoryEdit({ fetchCategories, catId }) {
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/get?id=${catId}`);
        const data = await response.json();
        setCategoryName(data.category);
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    fetchCategory();
  }, [catId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/categories/update/${catId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category: categoryName }),
      });
      if (!response.ok) {
        throw new Error("Failed to update category");
      }
      fetchCategories(); // Assuming fetchCategories is defined and accessible
      setCategoryName("");
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        placeholder="Enter category name"
        value={categoryName} // Set the value attribute to categoryName
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
