import mongoose from "mongoose"
import { invalidateCacheType, orderItemsType } from "../types/types.js";
import { myCache } from "../app.js";
import { Product } from "../models/products.js";

export const connectDB = (url : string) =>{
    mongoose.connect(url, {
        dbName : "E-Comm", 
    })
    .then((c) => console.log(`DB Connected to ${c.connection.host}`))
    .catch((e) => console.log(e));
}

export const invalidateCache = async({product , order , admin , userId , orderId , productIds} : invalidateCacheType) => {
    if(product){
        const productKey : string[] = [
            "latest-product",
            "categories",
            "all-products", 
            `product-${productIds}`
        ];

        productIds?.forEach((i) => productKey.push(`product-${i}`));

        myCache.del(productKey);
    }
    if(order){
        const ordersKeys :string[] = ["all-orders" , `my-orders-${userId}` , `order-${orderId}`];
        
        myCache.del(ordersKeys);

       
    }
    if(admin){

    }
}

export const reduceStock = async (orderItems: orderItemsType[]) => {
    for (let i = 0; i < orderItems.length; i++) {
      const order = orderItems[i];
      const product = await Product.findById(order.productId);
      if (!product) throw new Error("Product Not Found");
      product.stock -= order.quantity;
      await product.save();
    }
};

export const calculatePercentage = (thisMonth : number , lastMonth : number)=>{


    if(lastMonth === 0)return thisMonth*100;
    const percent = ((thisMonth - lastMonth)/lastMonth) * 100 ;

    return Number(percent.toFixed(0))   ;
};

export const getInventories = async ({
    categories,
    productsCount,
  }: {
    categories: string[];
    productsCount: number;
  }) => {
    const categoriesCountPromise = categories.map((category) =>
      Product.countDocuments({ category })
    );
  
    const categoriesCount = await Promise.all(categoriesCountPromise);
  
    const categoryCount: Record<string, number>[] = [];
  
    categories.forEach((category, i) => {
      categoryCount.push({
        [category]: Math.round((categoriesCount[i] / productsCount) * 100),
      });
    });
  
    return categoryCount;
  };
  