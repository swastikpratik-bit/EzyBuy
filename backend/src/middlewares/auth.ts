import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

// routes for only admin
export const adminOnly = TryCatch(async(req, res , next) =>{

    const { id } = req.query;

    if(!id)return next(new ErrorHandler("Login first !" , 401));

    const user = await User.findById(id);

    if(!user){
        return next(new ErrorHandler("User does not exist" , 401));
    }

    if(user.role !== "admin"){
        return next(new ErrorHandler("You Don't have admin rights" ,403));
    }

    next();
});
