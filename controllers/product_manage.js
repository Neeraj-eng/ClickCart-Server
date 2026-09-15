import Product from "../Models/Product.js";

// 🔹 ADD PRODUCT
export const addProduct = async (req, res) => {
  try {
    const { name, brand, description, price, category, quantity, date } = req.body;

    const product = await Product.create({
      name,
      brand,
      description,
      price,
      category,
      quantity,
      date,
      image: req.imageurl,
      createdBy: req.user.id,
    });

    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);

  } catch (err) {
    res.status(500).json({
      message: `Error fetching products: ${err.message}`,
    });
  }
};

// 🔹 GET SINGLE PRODUCT
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);

  } catch (err) {
    res.status(500).json({
      message: `Error fetching product: ${err.message}`,
    });
  }
};

// 🔹 DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      message: `Error deleting product: ${err.message}`,
    });
  }
};

// 🔹 UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.imageurl) {
      updateData.image = req.imageurl;
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(updated);

  } catch (err) {
    res.status(500).json({
      message: "Update failed",
    });
  }
};

// 🔹 SEARCH PRODUCTS
export const searchProducts = async (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword) {
    return res.status(400).json({
      message: "Enter a keyword please",
    });
  }

  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
      ],
    });

    res.status(200).json(products);

  } catch (err) {
    console.log("search product error", err.message);

    return res.status(500).json({
      message: err.message,
    });
  }
};