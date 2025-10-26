const Category = require("../models/Category");

async function createCategory(req, res) {
  try {
    const { name } = req.body;
    const cat = await Category.create({ name });
    res.status(201).json(cat);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error creating category" });
  }
}

async function listCategories(req, res) {
  const cats = await Category.find();
  res.json(cats);
}

async function editCategory(req, res) {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: "Not found" });
    cat.name = req.body.name || cat.name;
    await cat.save();
    res.json(cat);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error editing category" });
  }
}

async function deleteCategory(req, res) {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error deleting category" });
  }
}

module.exports = {
  createCategory,
  listCategories,
  editCategory,
  deleteCategory,
};
