import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { AllProductsResponse, CategoriesResponse, MessageResponse, UserResponse } from "../../types/api-types"
import { User } from "../../types/types"
import axios from "axios";

export const productAPI = createApi({
    reducerPath: "productApi" ,
    baseQuery : fetchBaseQuery({baseUrl : `${import.meta.env.VITE_SERVER}/api/v1/product/`}),
    endpoints : (builder) =>({
        latestProducts : builder.query<AllProductsResponse , string>({
            query : ()=> "latest"
        }),
        allProducts : builder.query<AllProductsResponse, string>({
            query: (id) => `adminproducts?id=${id}`  
        }), 
        categories : builder.query<CategoriesResponse, string>({
            query: () => `category`  
        }), 

    }),
   

});

export const {useLatestProductsQuery , useAllProductsQuery , useCategoriesQuery} = productAPI;
