const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env"), quiet: true });

const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

const app = express();

// Api routes
const categoryRoutes = require("./src/routes/category.route");
const subCategoryRoutes = require("./src/routes/subCategory.route");
const volumeRoutes=require("./src/routes/volume.route");
const productRoutes = require("./src/routes/product.route");

app.use(express.json());
app.use(cors());

// Api Urls
app.use("/api/category", categoryRoutes);
app.use("/api/subCategory", subCategoryRoutes);
app.use("/api/volume",volumeRoutes);
app.use("/api/product", productRoutes);
app.get("/", (req, res) => res.send("App is running"));

// Server port
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};

startServer();
