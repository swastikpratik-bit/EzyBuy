import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cartReducerInitialState } from "../types/reducer-types";
import axios from "axios";
import { server } from "../redux/store";
import toast from "react-hot-toast";
import { saveShippingInfo } from "../redux/reducer/cartReducer";

const Shipping = () => {


    const { cartItems , total } = useSelector((state : {cartReducer : cartReducerInitialState})  => state.cartReducer);

    const [shippingData , setShippingData] = useState({
        address : "", 
        city : "", 
        state : "", 
        country : "", 
        pinCode : ""
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeHandler = (e:ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>{
        setShippingData((prev) => ({...prev, [e.target.name] : e.target.value}))
    };

    const submitHandler = async(e : FormEvent<HTMLFormElement>) => {
        
        e.preventDefault();

        dispatch(saveShippingInfo(shippingData))

        try {
            const {data} = await axios.post(`${server}/api/v1/payment/create` , {
                amount : total
            },{
                headers :{
                    "Content-Type" : "application/json",
                },
            });

            navigate("/pay" ,{
                state : data.clientSecret,
            });
        } catch (error) {
            console.log(error)  ;
            toast.error("something went wrong");
        }
    };

    useEffect(()=>{
        if(cartItems.length <= 0 )return navigate("/cart");

    } ,[cartItems])

    return (
        <div className="shipping">
            <button className="back-btn" onClick={()=> navigate("/cart")}>
                <BiArrowBack/>
            </button>

            <form onSubmit={submitHandler}>
                <h1>Shipping Address</h1>
                <input type="text" placeholder="Address" name="address" value={shippingData.address} onChange={changeHandler} required/>
                <input type="text" placeholder="City" name="city" value={shippingData.city} onChange={changeHandler} required/>
                <input type="text" placeholder="State" name="state" value={shippingData.state} onChange={changeHandler} required/>

                <select name="country" required value={shippingData.country} onChange={changeHandler} >

                    <option value="">Choose Country</option>
                    <option value="india">India</option>
                </select>
                <input type="text" placeholder="Pin Code" name="pinCode" value={shippingData.pinCode} onChange={changeHandler} required/>

                <button type="submit">Pay Now</button>
            </form>
        </div>
    )
}
export default Shipping;
