import express from 'express';
import { deleteProduct, getAdminProducts, getAllCategories, getLatestProducts, newProduct, productDeatails, searchAllProducts, updateProduct } from '../controllers/products.js';
import { singleUpload } from '../middlewares/multer.js';
import { adminOnly } from '../middlewares/auth.js';
const app = express.Router();
app.post("/new", singleUpload, newProduct);
app.get("/latest", getLatestProducts);
app.get("/category", getAllCategories);
app.get("/adminproducts", adminOnly, getAdminProducts);
app.get("/all", searchAllProducts);
app.route("/:id")
    .get(productDeatails)
    .put(adminOnly, singleUpload, updateProduct)
    .delete(adminOnly, deleteProduct);
export default app;
