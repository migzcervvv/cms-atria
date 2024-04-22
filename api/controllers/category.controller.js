import Category from "../models/category.model.js";

// Controller methods
export const createCategory = async (req, res) => {
  try {
    const { category } = req.body;
    const newCategory = new Category({ category });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categoryId = req.query.id;
    if (categoryId) {
      // If ID is provided, fetch a single category by ID
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      return res.json(category);
    } else {
      // If ID is not provided, fetch all categories
      const categories = await Category.find();
      return res.json(categories);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { category },
      { new: true }
    );
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
