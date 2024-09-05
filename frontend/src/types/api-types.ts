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
export type ProductResponse = {
    success : Boolean;
    product : Product;
}
export type searchProductsResponse = {
    success : Boolean;
    products : Product[];
    totalPage : number;
}

export type searchProductsRequest = {
    price : number ;
    page : number;
    category : string ;
    search : string ;
    sort : string ;
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

export type  NewProductRequest = {
    id : string;
    formData : FormData;
}
export type  updateProductRequest = {
    userId : string;
    productId : string ;
    formData : FormData;
}
export type deleteProductRequest = {
    userId : string;
    productId : string ;
}