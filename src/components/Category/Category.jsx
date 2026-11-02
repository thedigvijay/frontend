import React,{useState,useEffect} from "react";
import Heading from "../Heading/Heading";
// import category from "../CardsData/Cards";
import Button from "../Buttonn/Button";
import { Link, useNavigate } from "react-router-dom";
// import Button from "../Button/Button";



 
const Category = () => {

const [category,setCategory] = useState([])
const navigate = useNavigate();



const hanldeSeeAll=(item)=>{

 navigate(`/category/${item._id}`);
}

const getCategory = async() =>{
const res = await fetch("http://localhost:3000/categories")
const data = await res.json();
setCategory(data);
}

const getProducts = async(category) =>{
const res = await fetch("http://localhost:3000/category-product?category="+ encodeURIComponent(category))
const data = await res.json();
// setCategory(data);
}

useEffect(()=>{
  getCategory();
  // getProducts("Fruits & Veggies");
},[]);




  const renderCards = (category.map((item)=> {
    return(
      <div className=" border flex flex-col gap-3 rounded-2xl p-3"> 
        <div className=" ">

          <img src={`/assets/${item.image}`} alt={item.title} />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold">{item.title}</h3>

          <p>{item.description}</p>
         <Button onClick={hanldeSeeAll(item)}content="See All" />

        </div>
      </div>
    )
  }))
   
  return (
    <section>
      <Heading highlight="Shop" heading="by Category" />

      {/* Category Card Section */}
      <div className="grid grid-cols-3 gap-4 px-5 py-1">
        {renderCards}
      </div>
       
    </section>
  );
};

export default Category;
