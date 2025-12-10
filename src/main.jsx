import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import ProductCategory from "./pages/ProductCategory.jsx";
import ProductSubcategory from "./pages/ProductSubCategory.jsx";
import Product from "./pages/Product.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="product-category" element={<ProductCategory />} />
          <Route path="product-subcategory" element={<ProductSubcategory />} />
          <Route path="product" element={<Product />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
