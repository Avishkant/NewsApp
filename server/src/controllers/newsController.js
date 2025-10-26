const News = require("../models/News");

async function createNews(req, res) {
  try {
    const { title, content, image, category } = req.body;
    const reporterId = req.user._id;
    const news = await News.create({
      title,
      content,
      image,
      category,
      reporterId,
    });
    res.status(201).json(news);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error creating news" });
  }
}

async function getAllNews(req, res) {
  const news = await News.find().populate("category reporterId", "name email");
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

    Object.assign(news, req.body);
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
