import { useState, useEffect } from "react";
import CategoryEdit from "../components/CategoryEdit";
import {
  BoneyardPageSkeleton,
  CategoryTableSkeleton,
} from "../components/PageSkeletons";

function CategoryPage() {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [editCategoryId, setEditCategoryId] = useState(null); // Store the ID of the category being edited
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/categories/get");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
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

  const handleEdit = async (id) => {
    try {
      // Set the ID of the category being edited
      setEditCategoryId(id);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  if (isLoading) {
    return (
      <BoneyardPageSkeleton
        name="category-table"
        loading
        fallback={<CategoryTableSkeleton />}
      >
        <CategoryTableSkeleton />
      </BoneyardPageSkeleton>
    );
  }

  return (
    <div className="flex flex-row items-start justify-center min-h-screen w-full">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold my-4">Categories</h1>
        {/* Render CategoryForm or CategoryEdit based on editCategoryId state */}
        {editCategoryId !== null ? ( // Check if an ID is set for editing
          <CategoryEdit
            catId={editCategoryId} // Pass the ID of the category being edited
            fetchCategories={fetchCategories}
          />
        ) : (
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
        )}
        {categories.length === 0 ? (
          <p className="rounded-lg border border-dashed border-neutral-200 px-4 py-8 text-center text-sm text-neutral-500">
            No categories found.
          </p>
        ) : (
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
                      onClick={() => handleEdit(category._id)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
