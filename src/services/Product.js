export const getProducts = async(id) =>{
const res = await fetch("http://localhost:3000/category-product?category="+ encodeURIComponent(id))
const data = await res.json();
return data;
}