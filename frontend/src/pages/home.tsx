import { Link } from "react-router-dom"
import ProductCard from "../components/productCard"
import { useLatestProductsQuery } from "../redux/api/productAPI"
import toast from "react-hot-toast";
import { Skeleton } from "../components/loader";
import { CartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
const Home = () => {

  const {data , isLoading , isError } = useLatestProductsQuery("");

  const dispatch = useDispatch();
  const addtoCartHandler = (cartItem : CartItem)=>{
    
    if( cartItem.stock < 1)return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added To Cart");

  }

  if(isError){
    toast.error("cannot fetch the products");
  }

  return (
    <div className="home">
      <section>
        
      </section>

      <h1>Latest Products <Link to={"/search"}> More </Link></h1>

      <main>
        {
          isLoading ? (<Skeleton width="80vh"/>):
           (data?.products.map((i) => (
            <ProductCard 
              productId={i._id}
              stock={Number(i.stock)}
              price={Number(i.price)}
              name={i.name} 
              handler={addtoCartHandler} photo={i.photo}/>
          )))
        }
      </main>
      
    </div>
  )
}

export default Home
