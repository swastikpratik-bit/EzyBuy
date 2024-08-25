import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/products.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";
export const newProduct = TryCatch(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    console.log(req.body);
    const photo = req.file;
    if (!photo) {
        return next(new ErrorHandler("Please Add Photo", 400));
    }
    if (!name || !price || !stock || !category) {
        rm(photo.path, () => { console.log("Deleted"); });
        return next(new ErrorHandler("Please Enter All Field", 400));
    }
    await Product.create({
        name,
        price,
        stock,
        category: category.toLowerCase(),
        photo: photo.path,
    });
    await invalidateCache({ product: true });
    return res.status(201).json({
        success: true,
        message: "Products created Successfully"
    });
});
//need to revalidate on new product , delete , new order
export const getLatestProducts = TryCatch(async (req, res, next) => {
    let products;
    if (myCache.has("latest-product")) {
        products = JSON.parse(myCache.get("latest-product"));
    }
    else {
        products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
        myCache.set("latest-product", JSON.stringify(products));
    }
    return res.status(200).json({
        success: true,
        products,
    });
});
export const getAllCategories = TryCatch(async (req, res, next) => {
    let categories;
    if (myCache.has("categories")) {
        categories = JSON.parse(myCache.get("categories"));
    }
    else {
        categories = await Product.distinct("category");
        myCache.set("categories", JSON.stringify(categories));
    }
    return res.status(200).json({
        success: true,
        categories,
    });
});
export const getAdminProducts = TryCatch(async (req, res, next) => {
    let products;
    if (myCache.has("all-products")) {
        products = JSON.parse(myCache.get("all-products"));
    }
    else {
        products = await Product.find({});
        myCache.set("all-products", JSON.stringify(products));
    }
    return res.status(200).json({
        success: true,
        products,
    });
});
export const productDeatails = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    let product;
    if (myCache.has(`product-${id}`)) {
        product = JSON.parse(myCache.get(`product-${id}`));
    }
    else {
        product = await Product.findById(id);
        myCache.set(`product-${id}`, JSON.stringify(product));
    }
    if (!product) {
        return next(new ErrorHandler("Product Not Found !", 404));
    }
    return res.status(200).json({
        success: true,
        product,
    });
});
export const updateProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product Not Found !", 404));
    }
    if (photo) {
        rm(product.photo, () => { console.log("Deleted old Photo"); });
        product.photo = photo.path;
    }
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category;
    product.save();
    await invalidateCache({
        product: true,
        productIds: [String(product._id)]
    });
    return res.status(201).json({
        success: true,
        message: "Products Updated Successfully"
    });
});
export const deleteProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product Not Found !", 404));
    }
    rm(product.photo, () => {
        console.log("Product Photo Deleted");
    });
    await product.deleteOne();
    await invalidateCache({
        product: true,
        productIds: [String(product._id)]
    });
    return res.status(200).json({
        success: true,
        message: "Products Deleted Successfully"
    });
});
export const searchAllProducts = TryCatch(async (req, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;
    const baseQ = {};
    if (search) {
        baseQ.name = {
            $regex: search,
            $options: "i"
        };
    }
    if (price) {
        baseQ.price = {
            $lte: Number(price),
        };
    }
    if (category)
        baseQ.category = category;
    const [products, filterProduct] = await Promise.all([Product.find(baseQ)
            .sort(sort && { price: sort === "ascending" ? 1 : -1 })
            .limit(limit)
            .skip(skip),
        Product.find(baseQ)
    ]);
    const totolPage = Math.ceil(filterProduct.length / limit);
    return res.status(200).json({
        success: true,
        products,
        totolPage,
    });
});
// const generateRandomProducts = async (count: number = 10) => {
//   const products = [];
//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: "uploads/71ea99e2-30ce-463d-abbb-78bc7b5596a1.png",
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     };
//     products.push(product);
//   }
//   await Product.create(products);
//   console.log({ succecss: true });
// };
// const deleteRandomsProducts = async (count: number = 10) => {
//   const products = await Product.find({}).skip(2);
//   for (let i = 0; i < products.length; i++) {
//     const product = products[i];
//     await product.deleteOne();
//   }
//   console.log({ succecss: true });
// };
// generateRandomProducts(5);
