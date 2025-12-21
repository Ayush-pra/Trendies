import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext';
import axios from "axios";
import { userDataContext } from './UserContext';

export const shopDataContext = createContext()

const ShopContext = ({children}) => {

    const [products, setproducts] = useState([]);
    const [search, setsearch] = useState("");
    const [showSearch, setshowSearch] = useState(false);
    const {serverUrl} = useContext(authDataContext);
    const [cartItem, setcartItem] = useState({});
    const {userData} = useContext(userDataContext);
    const currency="$";
    const delivery_fee=5;
    const getProducts = async()=>{
        try{
            const result = await axios.get(serverUrl+"/api/product/list");
            console.log(result.data);
            setproducts(result.data);
        }
        catch(error){
            console.log(error);
        }
    }

    const getUserCart = async()=>{
      try{
        const result = await axios.post(serverUrl + "/api/cart/get", {}, {withCredentials:true});
        setcartItem(result.data);
      }
      catch(error){ 
        console.log(error);
      }
    }

    const AddtoCart = async(itemId, size)=>{
          if(!size){
            alert("Select Product Size!!");
            return;
          }
          let cartData = structuredClone(cartItem);
          if(cartData[itemId]){
            if(cartData[itemId][size]){
              cartData[itemId][size]+=1;
            }
            else{
              cartData[itemId][size]=1;
            }
          }
          else{
            cartData[itemId]={};
            cartData[itemId][size]=1;
          }
          setcartItem(cartData);
          if(userData){
            try{
              await axios.post(serverUrl + "/api/cart/add", {itemId, size}, {withCredentials:true});
              console.log("added to cart");
            }
            catch(error){
              console.log(error);
         
            }
          }
    }

    const getCartCount = ()=>{
      let totalCount=0;
      for(const items in cartItem){
        for(const item in cartItem[items]){
          try{
            if(cartItem[items][item]>0){
              totalCount+=cartItem[items][item]
            }
          }
          catch(error){
            console.log(error);
          }
        }
      }
      return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {
  // clone cart
  const cartData = structuredClone(cartItem);

  if (quantity === 0) {
    // delete size
    delete cartData[itemId][size];
    if (Object.keys(cartData[itemId]).length === 0) {
      delete cartData[itemId]; // remove product if no sizes left
    }
  } else {
    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = quantity;
  }

  // update local state so UI re-renders
  setcartItem(cartData);

  // update backend if user logged in
  if (userData) {
    try {
      await axios.post(
        serverUrl + "/api/cart/update",
        { itemId, size, quantity },
        { withCredentials: true }
      );
      console.log("Cart updated");
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
    }
  }
};


    const getCartAmount = ()=>{
      let totalAmount = 0;
      for(const items in cartItem){
        let itemInfo = products.find((product)=>product._id===items);
        for(const item in cartItem[items]){
          try{
              if(cartItem[items][item]>0){
                totalAmount+=itemInfo.price * cartItem[items][item];
              }
          }
          catch(error){
              console.log(error);
          }
        }
      }
      return totalAmount;
    }

    useEffect(()=>{
        getProducts();
    }, []);

    useEffect(()=>{
      getUserCart();
    }, []);

    const value={
        products, currency, delivery_fee, getProducts,search, setsearch,showSearch, setshowSearch, cartItem, AddtoCart, getCartCount, setcartItem, updateQuantity, getCartAmount
    }
  return (
      <shopDataContext.Provider value={value}>
        {children}
      </shopDataContext.Provider>
  )
}

export default ShopContext
