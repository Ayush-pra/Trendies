import React from 'react'
import Title from '../components/Title'
import { useContext } from 'react'
import { shopDataContext } from '../context/ShopContext'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { RiDeleteBin6Line } from "react-icons/ri";
import CartTotal from '../components/CartTotal';
// import Cookies from "js-cookie";

const Cart = () => {
    const {products, currency, cartItem, updateQuantity} = useContext(shopDataContext);
    const [cartData, setcartData] = useState([]);
    const navigate = useNavigate();

    //  useEffect(() => {
    //     const token = Cookies.get("token");
    //     if (!token) {
    //         navigate("/login");
    //     }
    // }, []);
    
    useEffect(()=>{
        const tempData = [];
        for(const items in cartItem){
            for(const item in cartItem[items]){
                if(cartItem[items][item]>0){
                    tempData.push({
                        _id:items,
                        size:item, 
                        quantity:cartItem[items][item],
                    });
                }
            }
        }
        setcartData(tempData);
    }, [cartItem]);
  return (
    <div className='w-[99vw] min-h-[100vh] p-[20px] overflow-hidden bg-gradient-to-l from-[#040404] to-[#050c0e]'>
        <div className='h-[8%] w-[100%] text-center mt-[80px]'>
            <Title text1={"Your"} text2={"Cart"}/>
        </div>
        {cartData.length===0 ? (
                <div className='w-full text-center py-3'>
                    <p className='text-white text-[34px]'>
                        No items added into the Cart
                    </p>
                    <button 
                        className='text-[18px] hover:bg-slate-600 cursor-pointer bg-zinc-700 py-[10px] px-[30px] rounded-2xl text-white ml-[30px] mt-[15px]' 
                        onClick={() => navigate("/collection")} 
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <>
                <div className='w-[100%] h-[92%] flex flex-wrap gap-[20px]'>
                    {
                        cartData.map((item, index)=>{
                            const productData = products.find((product)=>product._id===item._id);
                            return(
                                <div key={index} className='w-[100%] h-[10%] border-t border-b'>
                                    <div className='w-[100%] h-[80%] flex items-start gap-6 bg-zinc-800 py-[10px] px-[20px] rounded-2xl relative'>
                                    <img className='w-[100px] h-[100px] rounded-md' src={productData.image1} alt="" />
                                    <div className='flex items-start justify-center flex-col gap-[10px]'>
                                        <p className='text-[20px] text-[white]'>{productData.name}</p>
                                        <div className='flex items-center gap-[20px]'>
                                            <p className='text-[20px] text-[#aaf4e7]'>{currency} {productData.price}</p>
                                            <p className='w-[40px] h-[40px] text-[16px] text-white bg-gray-500 rounded-md mt-[5px] flex items-center justify-center border-[1px] border-blue-300'>{item.size}</p>
                                        </div>
                                    </div>
                                    <input type='number' min={1} defaultValue={item.quantity} className='md:max-w-20 max-w-10 md:px-2 md:py-2 py-[5px] px-[10px] text-white text-[18px] font-semibold bg-green-800 absolute md:top-[40%] top-[46%] left-[75%] md:left-[50%] border-[1px] border-sky-300 rounded-md' onChange={(e)=>e.target.value===' '||e.target.value==='0'?null:updateQuantity(item._id, item.size, Number(e.target.value))}/>
                                    <RiDeleteBin6Line className='text-sky-300 w-[25px] h-[25px] absolute top-[50%] md:top-[40%] md:right-[5%] right-1 cursor-pointer' onClick={()=>updateQuantity(item._id, item.size,0)}/>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                </>
            )}   
        <div className='flex justify-start items-end my-20'>
            <div className='w-full sm:w-[450px]'>
                {cartData.length > 0 && (
                    <>
                    <CartTotal/>
                    <button className='text-[18px] hover:bg-slate-500 cursor-pointer bg-zinc-600 py-[10px] px-[50px] rounded-2xl text-white flex items-center justify-center gap-[20px] border-[1px] border-zinc-800 ml-[30px] mt-[20px]' onClick={()=>navigate("/placeorder")}>Proceed To Checkout</button>
                    </>
                )}
            </div>
        </div>
    </div>
  )
}

export default Cart
