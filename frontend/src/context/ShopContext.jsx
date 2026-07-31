import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext';
import axios from "axios";
import { userDataContext } from './UserContext';

export const shopDataContext = createContext()

const ShopContext = ({children}) => {

    const [products, setproducts] = useState([]); // Deprecated: no longer fetches full catalog
    const [cartProducts, setCartProducts] = useState([]); // Stores details for products currently in cart
    const [search, setsearch] = useState("");
    const [showSearch, setshowSearch] = useState(false);
    const {serverUrl} = useContext(authDataContext);
    const [cartItem, setcartItem] = useState({});
    const {userData} = useContext(userDataContext);
    const currency="₹";
    const delivery_fee=5;

    const getProducts = async()=>{
        // Intentionally left empty as we no longer fetch the full catalog globally.
        // Components should fetch their own data using /api/product/catalog
    }

    const fetchCartProducts = async () => {
        const ids = Object.keys(cartItem);
        if (ids.length === 0) {
            setCartProducts([]);
            return;
        }
        try {
            const response = await axios.post(serverUrl + "/api/product/by-ids", { ids });
            if (response.data.success) {
                setCartProducts(response.data.products);
            }
        } catch (error) {
            console.error("fetchCartProducts error:", error);
        }
    }

    useEffect(() => {
        fetchCartProducts();
    }, [cartItem]);

    const getUserCart = async()=>{
      try{
        const result = await axios.post(serverUrl + "/api/cart/get", {}, {withCredentials:true});
        setcartItem(result.data);
      }
      catch(error){ 
        console.error("getUserCart error:", error);
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
            }
            catch(error){
              // Revert optimistic update if stock check failed
              if (error.response?.status === 409) {
                setcartItem(cartItem); // revert to previous cart state
              }
              console.error("AddtoCart backend error:", error);
              throw error; // re-throw so ProductDetail can handle it
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
            console.error("getCartCount error:", error);
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
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
    }
  }
};


    const getCartAmount = ()=>{
      let totalAmount = 0;
      for(const items in cartItem){
        let itemInfo = cartProducts.find((product)=>product._id===items);
        if (!itemInfo) continue;
        for(const item in cartItem[items]){
          try{
              if(cartItem[items][item]>0){
                totalAmount+=itemInfo.price * cartItem[items][item];
              }
          }
          catch(error){
              console.error("getCartAmount error:", error);
          }
        }
      }
      return totalAmount;
    }

    // Removed getProducts() on mount since we no longer want the full catalog.

    useEffect(() => {
      if (userData) {
        getUserCart();
      } else {
        setcartItem({});
      }
    }, [userData]);

    const value={
        products, cartProducts, currency, delivery_fee, getProducts,search, setsearch,showSearch, setshowSearch, cartItem, AddtoCart, getCartCount, setcartItem, updateQuantity, getCartAmount
    }
  return (
      <shopDataContext.Provider value={value}>
        {children}
      </shopDataContext.Provider>
  )
}

export default ShopContext
