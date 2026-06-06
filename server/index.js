const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env"), quiet: true });

const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const errorMiddleware = require("./src/middlewares/errorMiddleware");

const app = express();

// Api routes
const authRoutes = require("./src/routes/auth.route");
const categoryRoutes = require("./src/routes/category.route");
const subCategoryRoutes = require("./src/routes/subCategory.route");
const volumeRoutes = require("./src/routes/volume.route");
const brandRoutes = require("./src/routes/brand.route");
const productRoutes = require("./src/routes/product.route");
const productVariantRoutes = require("./src/routes/productVariant.route");

app.use(express.json());
app.use(cors());

// Api Urls
app.use("/api/auth",authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/subCategory", subCategoryRoutes);
app.use("/api/volume", volumeRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/product", productRoutes);
app.use("/api/product/", productVariantRoutes);
app.get("/", (req, res) => res.send("App is running"));

app.use(errorMiddleware);

// Server port
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};

startServer();
