export type User = {
    name: string;
    email: string;
    photo: string;
    gender: string;
    role: string;
    dob: string;
    _id: string;
};

export type Product = {
    name: string;
    price: number;
    photo: string;
    stock: number;
    category: string;
    _id: string;
};
export type ShippingInfo = {
    address : string ; 
    city : string ; 
    state : string , 
    country : string ;
    pinCode : string ;
};

export type CartItem = {
    productId : string;
    photo : string; 
    name : string;
    price : number;
    quantity : number; 
    stock : number;
};


export type OrderItem = Omit<CartItem , "stock"> & {_id : string}; 

export type Order = {
    orderItems : OrderItem[];
    shippingInfo : ShippingInfo ;
    subtotal : number ; 
    tax : number ; 
    shippingCharges : number ; 
    discount : number ; 
    total : number ;
    status : string ; 
    user : {
        name : string ;
        _id : string ;
    };
    _id : string ;


}

type percentChangeType = {
    revenue: number;
    user: number;
    order: number;
    product: number;
}

type LatestTransactionType = {
    _id: string; 
    discount: number;
    amount: number;
    quantity: number;
    status: string ;
}

export type Stats = {
    categoryCount : Record<string, number>[],
    changePercentage : percentChangeType ,
    counts : percentChangeType,
    chart : {
        order : number[] , 
        revenue : number[],
    },
    userRatio : {
        male: number;
        female: number;
    },

    latestTransaction : LatestTransactionType, 
}



