import { Link } from "react-router-dom"
import ProductCard from "../components/productCard"
import { useLatestProductsQuery } from "../redux/api/productAPI"
import toast from "react-hot-toast";
import { Skeleton } from "../components/loader";
const Home = () => {

  const {data , isLoading , isError } = useLatestProductsQuery("");

  const addtoCartHandler = ()=>{

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
