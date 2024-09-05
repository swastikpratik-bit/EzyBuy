import { useState } from "react";
import ProductCard from "../components/productCard";
import { useCategoriesQuery, useSearchProductsQuery } from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { CustomError } from "../types/api-types";
import { Skeleton } from "../components/loader";

const Search = () => {

  const {data : categoriesResponse , isLoading , isError , error } = useCategoriesQuery("");

  const [search , setSearch] = useState("");
  const [sort , setSort] = useState("");
  const [maxPrice , setMaxPrice] = useState(10000);
  const [category , setCategory] = useState("");
  const [page , setPage] = useState(1);

  const {isLoading: productLoading , data : searchedData , isError : productIsError, error : productError} = useSearchProductsQuery({search , sort , category , page ,price : maxPrice })

  const isNextPage = page < 10;
  const isPrevPage = page > 1;

  if(isError){
    toast.error((error as CustomError).data.message)  ;
  }
  if(productIsError){
    toast.error((productError as CustomError).data.message)  ;
  }

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
              <option value="">SELECT</option>
              {
                !isLoading && categoriesResponse?.categories.map((i) => (
                  <option key={i} value={i}>{i.toUpperCase()}</option>
                ))
              }
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
 
        {
          productLoading ? <Skeleton length={10}/> : (
            <div className="search-products">
              {
                searchedData?.products.map((i) => (
                  <ProductCard 
                    key={i._id}
                    productId={i._id}
                    stock={Number(i.stock)}
                    price={Number(i.price)}
                    name={i.name} 
                    handler={addtoCartHandler} photo={i.photo}/>
                ))
              }
            </div>
          )
        }


        {
          searchedData && searchedData?.totalPage > 1 && (
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
          )
        }

      </main>
    </div>
  )
}

export default Search;
