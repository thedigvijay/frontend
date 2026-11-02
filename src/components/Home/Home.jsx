import React from "react";
import Navbar from "../Navbar/Navbar";
import Hero from "../Hero/Hero";
import Category from "../Category/Category";
import AddProduct from "../addProduct/addProduct";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Category />
      <AddProduct />
    </div>
  );
};

export default Home;
