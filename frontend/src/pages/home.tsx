import { Link } from "react-router-dom"
import ProductCard from "../components/productCard"
const Home = () => {

  const addtoCartHandler = ()=>{

  }

  return (
    <div className="home">
      <section>
        
      </section>

      <h1>Latest Products <Link to={"/search"}> More </Link></h1>

      <main>
        <ProductCard productId="kdfaj" stock={23} price={54990} name="MacMini" handler={addtoCartHandler} photo="https://m.media-amazon.com/images/I/21laeQrFUTL._SY445_SX342_QL70_FMwebp_.jpg"/>
      </main>
      
    </div>
  )
}

export default Home
