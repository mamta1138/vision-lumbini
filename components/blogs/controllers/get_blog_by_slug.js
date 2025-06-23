const Blog = require("../models/blog_model");

const generateNepaliSlug = (text) => {
  return text
    .trim()
    .replace(/[।.,/#!$%^&*;:{}=_~()]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
};

const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const normalizedSlug = generateNepaliSlug(slug);

    const blog = await Blog.findOne({ slug: normalizedSlug })
      .populate("categories", "name slug _id")
      .populate("tags", "name slug");


    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const categoryId = blog.categories?._id;

    const recommendations = categoryId
      ? await Blog.find({
          _id: { $ne: blog._id },
          categories: categoryId
        })
          .populate("categories", "name slug")
          .limit(3)
      : [];

    return res.status(200).json({ blog, recommendations });
  } catch (error) {
    console.error("Get Blog by Slug Error:", error);
    return res
      .status(500)
      .json({ message: "Error fetching blog and recommendations" });
  }
};

module.exports = getBlogBySlug;
