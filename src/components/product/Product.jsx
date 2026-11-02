import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { getProducts } from '../../services/Product';

const Product = () => {

    const { id } = useParams();

    const fetchProduct = async()=>{
         const data = await getProducts(id);
         console.log(data);
    }

    useEffect(() => {
    fetchProduct();
  }, [id]);
  
  return (
    <div>Product</div>
  )
}

export default Product