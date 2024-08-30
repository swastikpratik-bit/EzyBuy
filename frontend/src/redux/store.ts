import {configureStore} from "@reduxjs/toolkit";
import { userAPI } from "./api/userAPI";
import { userReducer } from "./reducer/userReducer";


export const store = configureStore({
    reducer : {
        [userAPI.reducerPath] : userAPI.reducer, 
        [userReducer.name] : userReducer.reducer,
    }, 
    //@ts-ignore
    middleware : (mid) => [
        ...mid(),
        userAPI.middleware,
    ],
});