import { CartItem, Order, Product, ShippingInfo, Stats, User } from "./types";


export type CustomError = {
    status : number;  
    data : { 
        message : string ;
        success : boolean;
    }
};
export type MessageResponse = {
    success : Boolean ;
    message : string ;
}
export type allUserResponse = {
    success : Boolean ;
    users : User[];
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

export type  AllOrderResponse = {
    success : boolean ;
    orders : Order[];
};

export type  orderDetailsResponse = {
    success : boolean ;
    order : Order;
};

export type  statsResponse = {
    success : boolean ;
    stats : Stats;
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

export type newOrderRequest = {
    shippingInfo : ShippingInfo ,
    orderItem : CartItem[] , 
    subtotal : number ; 
    tax : number ; 
    shippingCharges : number ; 
    discount : number ; 
    total : number ;
    user : string , 
};

export type updateOrderRequest = {
    userId : String; 
    orderId : String ;
};

export type deleteUserRequest = {
    userId : String; 
    adminUserId  : String ;
};
