import { useState } from "react";
import ProductCard from "../components/productCard";

const Search = () => {

  const [search , setSearch] = useState("");
  const [sort , setSort] = useState("");
  const [maxPrice , setMaxPrice] = useState(10000);
  const [category , setCategory] = useState("");
  const [page , setPage] = useState(1);
  const isNextPage = page < 10;
  const isPrevPage = page > 1;

  const addtoCartHandler = ()=>{

  }

  


  return (
    <div className="search-page">
      <aside>
        <h2>Filter</h2>
        <div>
          <h4>Sort</h4>
          <select
            value={sort}
            onChange={(e)=> setSort(e.target.value)}
            >
              <option value="">Any</option>
              <option value="ascending">Price(Low to High)</option>
              <option value="descending">Price(High to Low)</option>
            
          </select>
        </div>

        <div>
          <h4>Max Price : { maxPrice || ""}</h4>
          <input
            min={100}
            max={100000}
            type="range"
            value={maxPrice}
            onChange={(e)=> setMaxPrice(Number(e.target.value))}
            >              
          </input>
        </div>

        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e)=> setCategory(e.target.value)}
            >
              <option value="">Any</option>
              <option value="">dummy1</option>
              <option value="">dummy2</option>
            
          </select>
        </div>



      </aside>

      <main>
        <h1>Products</h1>
        <input 
          type="text" 
          placeholder="Search by name...."
          value={search}
          onChange={(e)=> setSearch(e.target.value)}
        />
 
        <div className="search-products">
        <ProductCard productId="kdfaj" stock={23} price={54990} name="MacMini" handler={addtoCartHandler} photo="https://m.media-amazon.com/images/I/21laeQrFUTL._SY445_SX342_QL70_FMwebp_.jpg"/>


        </div>


        <article>
          <button 
            disabled={!isPrevPage} 
            onClick={() => setPage(prev => prev - 1)}
          >
            Prev
          </button>
          <span>{page} of {10}</span>
          <button 
            disabled={!isNextPage}
            onClick={() => setPage(prev => prev + 1)}
          >
            next
          </button>
        </article>

      </main>
    </div>
  )
}

export default Search;
