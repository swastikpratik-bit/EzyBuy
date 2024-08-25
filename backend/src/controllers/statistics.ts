import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/orders.js";
import { Product } from "../models/products.js";
import { User } from "../models/user.js";
import { calculatePercentage, getInventories } from "../utils/features.js";

export const getDashboardStats = TryCatch(async(req, res, next)=> {

    let stats ;

    if(myCache.has("admin-stats")){
        stats = JSON.parse(myCache.get("admin-stats") as string) ;
    }
    else{

        const today = new Date();

        const startOfThisMonth = new Date(today.getFullYear(), today.getMonth() , 1);
        const endOfThisMonth = today;
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 0);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const ThisMonthProductsPromise = await Product.find({
            createdAt:{
                $gte: startOfThisMonth, 
                $lte : endOfThisMonth
            },
        })
        
        const LastMonthProductsPromise = await Product.find({
            createdAt:{
                $gte: startOfLastMonth, 
                $lte : endOfLastMonth
            },
        })

        const ThisMonthUserPromise = await User.find({
            createdAt:{
                $gte: startOfThisMonth, 
                $lte : endOfThisMonth
            },
        })

        const LastMonthUserPromise = await User.find({
            createdAt:{
                $gte: startOfLastMonth, 
                $lte : endOfLastMonth
            },
        })
        const ThisMonthOrdersPromise = await Order.find({
            createdAt:{
                $gte: startOfThisMonth, 
                $lte : endOfThisMonth
            },
        })

        const LastMonthOrdersPromise = await Order.find({
            createdAt:{
                $gte: startOfLastMonth, 
                $lte : endOfLastMonth
            },
        });

        const lastSixMonthOrdersPromise = Order.find({
            createdAt: {
              $gte: sixMonthsAgo,
              $lte: today,
            },
          });
    
        const latestTransactionsPromise = Order.find({})
        .select(["orderItems", "discount", "total", "status"])
        .limit(4);

        const [
            LastMonthProducts,
            LastMonthUser,
            LastMonthOrders,
            ThisMonthProducts,
            ThisMonthUser,
            ThisMonthOrders,
            productsCount,
            usersCount,
            allOrders,
            lastSixMonthOrders,
            categories,
            femaleUsersCount,
            latestTransaction,

        ] = await Promise.all([
            LastMonthProductsPromise,
            LastMonthUserPromise,
            LastMonthOrdersPromise,
            ThisMonthProductsPromise,
            ThisMonthUserPromise,
            ThisMonthOrdersPromise,
            Product.countDocuments(),
            User.countDocuments(),
            Order.find({}).select("total"),
            lastSixMonthOrdersPromise,
            Product.distinct("category"),
            User.countDocuments({ gender: "female" }),
            latestTransactionsPromise,
           
        ]);

        const thisMonthRevenue = ThisMonthOrders.reduce(
            (total , order) => total + (order.total || 0) , 0
        );
        const LastMonthRevenue = LastMonthOrders.reduce(
            (total , order) => total + (order.total || 0) , 0
        );

        const changePercentage = {
            revenue : calculatePercentage(
                thisMonthRevenue,
                LastMonthRevenue
            ),
            user : calculatePercentage(
                ThisMonthUser.length, 
                LastMonthUser.length
    
            ),
            order : calculatePercentage(
                ThisMonthOrders.length, 
                LastMonthOrders.length
            ),
            product : calculatePercentage(
                ThisMonthProducts.length, 
                LastMonthProducts.length
            )
        }

        const revenue = allOrders.reduce(
            (total , order )=> total + (order.total || 0) , 0
        );

        const counts = {
            revenue,
            user : usersCount,
            product : productsCount,
            order : allOrders.length,
        };

        const orderMonthsCounts = new Array(6).fill(0);
        const orderMonthlyRevenue= new Array(6).fill(0);

        lastSixMonthOrders.forEach((order) => {
            const creationDate = order.createdAt;
            const monthDiff = today.getMonth() - creationDate.getMonth();

            if(monthDiff < 6){
                orderMonthsCounts[6 - monthDiff - 1]++;
                orderMonthlyRevenue[6 - monthDiff - 1]+= order.total;
            }
        });

        const categoriesCountPromise = categories.map(category => Product.countDocuments({category}));

        const categoriesCount = await Promise.all(categoriesCountPromise);

        const categoryCount : Record<string, number> []= [];

        categories.forEach((category , i) =>{
            categoryCount.push({
                [category] : Math.round((categoriesCount[i]/productsCount) * 100),
            })
        });

        const userRatio = {
            male : usersCount - femaleUsersCount, 
            female : femaleUsersCount
        };

        const modifiedLatestTransaction = latestTransaction.map((i) => ({
            _id: i._id,
            discount: i.discount,
            amount: i.total,
            quantity: i.orderItems.length,
            status: i.status,
        }));


        
        stats = { 
            categoryCount,
            changePercentage ,
            counts, 
            chart : {
                order : orderMonthsCounts , 
                revenue : orderMonthlyRevenue,
            },
            userRatio,
            latestTransaction : modifiedLatestTransaction,            
        };

        myCache.set("admin-stats" , JSON.stringify(stats));
    }

    return res.status(200).json({
        success : true, 
        stats,
    })

});

export const getPieCharts = TryCatch(async (req, res, next) => {
    let charts;
    const key = "admin-pie-charts";      
    if (myCache.has("admin-pie-charts")) {
        charts = JSON.parse(myCache.get("admin-pie-charts")as string);
    }
    else {
        const allOrderPromise = Order.find({}).select([
        "total",
        "discount",
        "subtotal",
        "tax",
        "shippingCharges",
        ]);
    
        const [
        processingOrder,
        shippedOrder,
        deliveredOrder,
        categories,
        productsCount,
        outOfStock,
        allOrders,
        allUsers,
        adminUsers,
        customerUsers,
        ] = await Promise.all([
        Order.countDocuments({ status: "Processing" }),
        Order.countDocuments({ status: "Shipped" }),
        Order.countDocuments({ status: "Delivered" }),
        Product.distinct("category"),
        Product.countDocuments(),
        Product.countDocuments({ stock: 0 }),
        allOrderPromise,
        User.find({}).select(["dob"]),
        User.countDocuments({ role: "admin" }),
        User.countDocuments({ role: "user" }),
        ]);
    
        const orderFullfillment = {
            processing: processingOrder,
            shipped: shippedOrder,
            delivered: deliveredOrder,
        };
    
        const productCategories = await getInventories({
            categories,
            productsCount,
        });
    
        const stockAvailablity = {
            inStock: productsCount - outOfStock,
            outOfStock : outOfStock
        };
    
        const grossIncome = allOrders.reduce(
        (prev, order) => prev + (order.total || 0),
        0
        );
    
        const discount = allOrders.reduce(
        (prev, order) => prev + (order.discount || 0),
        0
        );
    
        const productionCost = allOrders.reduce(
        (prev, order) => prev + (order.shippingCharges || 0),
        0
        );
    
        const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);
    
        const marketingCost = Math.round(grossIncome * (25 / 100));
    
        const netMargin =
        grossIncome - discount - productionCost - burnt - marketingCost;
    
        const revenueDistribution = {
            netMargin,
            discount,
            productionCost,
            burnt,
            marketingCost,
        };
    
        const usersAgeGroup = {
            teen: allUsers.filter((i) => i.age < 20).length,
            adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
            old: allUsers.filter((i) => i.age >= 40).length,
        };
    
        const adminCustomer = {
        admin: adminUsers,
        customer: customerUsers,
        };
    
        charts = {
            orderFullfillment,
            productCategories,
            stockAvailablity,
            revenueDistribution,
            usersAgeGroup,
            adminCustomer,
        };
    
        myCache.set("admin-pie-charts" , JSON.stringify(charts));
        
    }
    
    return res.status(200).json({
        success: true,
        charts,
    });
});
export const getBarChart = TryCatch(async(req, res, next)=> {

});
export const getLineChart = TryCatch(async(req, res, next)=> {

});

