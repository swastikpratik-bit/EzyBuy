import { ChangeEvent, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Shipping = () => {


    const [shippingData , setShippingData] = useState({
        address : "", 
        city : "", 
        state : "", 
        country : "", 
        pinCode : ""
    });

    const navigate = useNavigate();

    const changeHandler = (e:ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>{
        setShippingData((prev) => ({...prev, [e.target.name] : e.target.value}))
    };
    return (
        <div className="shipping">
            <button className="back-btn" onClick={()=> navigate("/cart")}>
                <BiArrowBack/>
            </button>

            <form>
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
