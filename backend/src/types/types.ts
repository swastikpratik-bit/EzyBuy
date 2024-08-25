import { NextFunction, Request, Response } from "express"
import { invalidateCache } from "../utils/features.js";

export interface NewUserRequestBody{
    name: string , 
    email : string , 
    photo : string , 
    gender : string , 
    _id: string , 
    dob: Date
}

export interface NewProductRequestBody{
    name: string , 
    category : string , 
    price : number , 
    stock : number , 
}

export type ControllerType =  ( 
    req: Request<any>,
    res : Response, 
    next : NextFunction
) => Promise<void | Response<any, Record<string,any>>>;


export type SearchRequestQueryType ={
    search? : string;
    price? :string;
    category? : string ;
    sort? : string ;
    page? : string ; 

}

export interface baseQType {
    name?:{
        $regex : String ;
        $options : String;
    };
    price?:{$lte : Number};
    category? :string ;
}

export type invalidateCacheType ={
    product? : boolean;
    order? : boolean;
    admin? : boolean;
    userId?: string;
    orderId? :string;
    productIds?: string[];
}

export type orderItemsType = {
    name : string;
    photo : string; 
    price : string;
    quantity : number; 
    productId : string;

}

export type shippingInfoType = {
    address : string;
    city : string; 
    state : string;
    country : string ; 
    pinCode : number;

}

export interface NewOrderRequestBody{
    shippingInfo : shippingInfoType;
    user : string;
    subTotal : number; 
    tax : number;
    shippingCharges : number; 
    discount : number;
    total : number;
    orderItems : orderItemsType[];
}