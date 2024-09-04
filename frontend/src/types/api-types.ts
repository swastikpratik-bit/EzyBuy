import { Product, User } from "./types";

export type MessageResponse = {
    success : Boolean ;
    message : string ;
}
export type UserResponse = {
    success : Boolean ;
    user : User;
}

export type AllProductsResponse = {
    success : Boolean;
    products : Product[];
}

export type CategoriesResponse = {
    success : Boolean;
    categories : string[];
}

export type CustomError = {
    status : number;  
    data : { 
        message : string ;
        success : boolean;
    }
};