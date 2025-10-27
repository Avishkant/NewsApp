const News = require("../models/News");

async function createNews(req, res) {
  try {
    const { title, content, image, category, district, link } = req.body;
    const reporterId = req.user._id;
    const news = await News.create({
      title,
      content,
      image,
      category,
      district,
      link,
      reporterId,
    });
    res.status(201).json(news);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error creating news" });
  }
}

async function getAllNews(req, res) {
  const filter = {};
  if (req.query.district) filter.district = req.query.district; // expects district id
  // optional category filter
  if (req.query.category) filter.category = req.query.category;
  const news = await News.find(filter).populate(
    "category reporterId district",
    "name name"
  );
  res.json(news);
}

async function getNewsById(req, res) {
  try {
    const news = await News.findById(req.params.id).populate(
      "category reporterId",
      "name email"
    );
    if (!news) return res.status(404).json({ message: "Not found" });
    news.views = (news.views || 0) + 1;
    await news.save();
    res.json(news);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error fetching news" });
  }
}

async function updateNews(req, res) {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "Not found" });

    // only owner or the reporter who created can update
    if (req.user.role !== "owner" && !news.reporterId.equals(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Only allow the expected fields to be updated to avoid accidental overwrites
    const updatable = [
      "title",
      "content",
      "image",
      "category",
      "district",
      "link",
    ];
    updatable.forEach((k) => {
      if (req.body[k] !== undefined) news[k] = req.body[k];
    });
    await news.save();
    res.json(news);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error updating news" });
  }
}

async function deleteNews(req, res) {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "Not found" });
    if (req.user.role !== "owner" && !news.reporterId.equals(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await news.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error deleting news" });
  }
}

module.exports = {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
};
