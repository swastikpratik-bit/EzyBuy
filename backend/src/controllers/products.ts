import { NextFunction, Request, Response, response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { baseQType, NewProductRequestBody, SearchRequestQueryType } from "../types/types.js";
import { Product } from "../models/products.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { invalidateCache } from "../utils/features.js";
import { myCache } from "../app.js";

export const newProduct = TryCatch(
    async(
        req : Request<{} , {}, NewProductRequestBody>, 
        res :Response , 
        next : NextFunction) => {

        const {name , price, stock , category} = req.body;

        const photo = req.file;

        if(!photo){
            return next(new ErrorHandler("Please Add Photo" , 400));
        }

        if(!name || !price || !stock || !category){
            rm(photo.path , ()=>{console.log("Deleted")})
            return next(new ErrorHandler("Please Enter All Field", 400));
        }
        await Product.create({
            name, 
            price, 
            stock, 
            category : category.toLowerCase(), 
            photo : photo.path, 
        });

        return res.status(201).json({
            success :true , 
            message : "Products created Successfully"
        });
});

export const getLatestProducts = TryCatch(async(req, res,next) =>{
    const products = await Product.find({}).sort({createdAt : -1}).limit(5);     
    return res.status(200).json({
        success: true , 
        products,
    })
});

export const getAllCategories = TryCatch(async(req, res,next) =>{
    
    const categories = await Product.distinct("category");
    return res.status(200).json({
        success: true , 
        categories,
    })
})


export const getAdminProducts = TryCatch(async(req, res,next) =>{
    const products = await Product.find({});
    
    return res.status(200).json({
        success: true , 
        products,
    });
});

export const productDeatails = TryCatch(async(req, res,next) =>{
    const product = await Product.findById(req.params.id);

    return res.status(200).json({
        success: true , 
        product,
    });
});

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, category, description } = req.body;
  const photos = req.files as Express.Multer.File[] | undefined;

  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Product Not Found", 404));

//   if (photos && photos.length > 0) {
//     // const photosURL = await uploadToCloudinary(photos);

//     // const ids = product.photos.map((photo) => photo.public_id);

//     // await deleteFromCloudinary(ids);

//     product.photos = photosURL;
//   }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;
//   if (description) product.description = description;

  await product.save();

    invalidateCache({
    product: true,
    productIds: [String(product._id)],
    admin: true,
  });

  return res.status(200).json({
    success: true,
    message: "Product Updated Successfully",
  });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));
  
    // const ids = product.photos.map((photo) => photo.public_id);
  
    // await deleteFromCloudinary(ids);
  
    await product.deleteOne();
  
    invalidateCache({
      product: true,
      productIds: [String(product._id)],
      admin: true,
    });
  
    return res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
});

export const searchAllProducts = TryCatch(
    async (req: Request<{}, {}, {}, SearchRequestQueryType>, res, next) => {
      const { search, sort, category, price } = req.query;
  
      const page = Number(req.query.page) || 1;
  
      const key = `products-${search}-${sort}-${category}-${price}-${page}`;
  
      let products;
      let totalPage;
  
      const cachedData = myCache.get(key);
      if (cachedData) {
        const data = JSON.parse(cachedData as string);
        totalPage = data.totalPage;
        products = data.products;
      } else {
        // 1,2,3,4,5,6,7,8
        // 9,10,11,12,13,14,15,16
        // 17,18,19,20,21,22,23,24
        const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
        const skip = (page - 1) * limit;
  
        const baseQuery: baseQType = {};
  
        if(search)
          baseQuery.name = {
            $regex: search,
            $options: "i",
          };
  
        if(price)
          baseQuery.price = {
            $lte: Number(price),
          };
  
        if (category) baseQuery.category = category;
  
        const productsPromise = Product.find(baseQuery)
          .sort(sort && { price: sort === "ascending" ? 1 : -1 })
          .limit(limit)
          .skip(skip);
  
        const [productsFetched, filteredOnlyProduct] = await Promise.all([
          productsPromise,
          Product.find(baseQuery),
        ]);
  
        products = productsFetched;
        totalPage = Math.ceil(filteredOnlyProduct.length / limit);
        
        myCache.set(key , JSON.stringify({products , totalPage }));
      }
  
      return res.status(200).json({
        success: true,
        products,
        totalPage,
      });
    }
  );
