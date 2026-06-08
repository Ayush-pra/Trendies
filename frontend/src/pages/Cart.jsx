import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/Title'
import { shopDataContext } from '../context/ShopContext'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { RiDeleteBin6Line } from "react-icons/ri";
import CartTotal from '../components/CartTotal';

const Cart = () => {
    const { products, currency, cartItem, updateQuantity } = useContext(shopDataContext);
    const { userData, authLoading } = useContext(userDataContext);
    const [cartData, setcartData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !userData) {
            navigate("/login");
        }
    }, [authLoading, userData]);

    useEffect(() => {
        const tempData = [];
        for (const items in cartItem) {
            for (const item in cartItem[items]) {
                if (cartItem[items][item] > 0) {
                    tempData.push({
                        _id: items,
                        size: item,
                        quantity: cartItem[items][item],
                    });
                }
            }
        }
        setcartData(tempData);
    }, [cartItem]);
    return (
        <div className='w-full min-h-screen px-3 sm:px-5 overflow-hidden bg-gradient-to-l from-[#040404] to-[#050c0e]'>
            <div className='w-full text-center pt-20 sm:pt-24 pb-4'>
                <Title text1={"Your"} text2={"Cart"} />
            </div>
            {cartData.length === 0 ? (
                <div className='w-full text-center py-3'>
                    <p className='text-white text-xl sm:text-[34px]'>
                        No items added into the Cart
                    </p>
                    <button
                        className='text-sm sm:text-[18px] hover:bg-slate-600 cursor-pointer bg-zinc-700 py-2.5 px-6 sm:py-[10px] sm:px-[30px] rounded-2xl text-white mt-4'
                        onClick={() => navigate("/collection")}
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <>
                    <div className='w-full space-y-3'>
                        {
                            cartData.map((item, index) => {
                                const productData = products.find((product) => product._id === item._id);
                                return (
                                    <div key={index} className='border-t border-b'>
                                        <div className='w-full flex items-center gap-3 sm:gap-6 bg-zinc-800 py-3 px-3 sm:px-5 rounded-2xl'>
                                            <img className='w-16 h-16 sm:w-[100px] sm:h-[100px] rounded-md object-cover flex-shrink-0' src={productData.image1} alt="" />
                                            <div className='flex-1 min-w-0 space-y-1'>
                                                <p className='text-sm sm:text-[20px] text-white truncate'>{productData.name}</p>
                                                <div className='flex items-center gap-2 sm:gap-5 flex-wrap'>
                                                    <p className='text-sm sm:text-[20px] text-[#aaf4e7]'>{currency} {productData.price}</p>
                                                    <p className='w-8 h-8 sm:w-[40px] sm:h-[40px] text-xs sm:text-[16px] text-white bg-gray-500 rounded-md flex items-center justify-center border border-blue-300'>{item.size}</p>
                                                </div>
                                            </div>
                                            <input type='number' min={1} defaultValue={item.quantity} className='w-12 sm:w-16 py-1.5 px-2 text-white text-sm sm:text-[18px] font-semibold bg-green-800 border border-sky-300 rounded-md text-center flex-shrink-0' onChange={(e) => e.target.value === ' ' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))} />
                                            <RiDeleteBin6Line className='text-sky-300 w-5 h-5 sm:w-[25px] sm:h-[25px] cursor-pointer flex-shrink-0' onClick={() => updateQuantity(item._id, item.size, 0)} />
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </>
            )}
            <div className='flex justify-start items-end my-10 sm:my-20'>
                <div className='w-full sm:w-[450px]'>
                    {cartData.length > 0 && (
                        <>
                            <CartTotal />
                            <button className='text-sm sm:text-[18px] hover:bg-slate-500 cursor-pointer bg-zinc-600 py-2.5 px-6 sm:py-[10px] sm:px-[50px] rounded-2xl text-white flex items-center justify-center gap-3 sm:gap-5 border border-zinc-800 mt-5' onClick={() => navigate("/placeorder")}>Proceed To Checkout</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Cart
