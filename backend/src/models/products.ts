import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
    
        name:{
            type : String , 
            required: [true , "Please Enter Name"],
        },
        price:{
            type : Number , 
            required: [true , "Please Enter Price"],
        },
        stock:{
            type : Number , 
            required: [true , "Please Enter Stock"],
        },
        photo:{
            type : String , 
            required :[true, "Please add Photo"]    
        },
        category:{
            type : String , 
            required: [true , "Please Enter Product Category"],
            trim : true,
        },
    },

    {
        timestamps : true,
    }
);



export const Product = mongoose.model('Product', schema);