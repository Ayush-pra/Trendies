// import React, { useContext } from 'react';
// import { shopDataContext } from '../context/ShopContext';
// import Title from './Title';

// const CartTotal = () => {
//     const {currency, delivery_fee, getCartAmount} = useContext(shopDataContext);
//   return (
//     <div className='w-full lg:ml-[30px]'>
//       <div className='text-xl py-[10px]'>
//         <Title text1={"Cart"} text2={"Total"}/>
//       </div>
//       <div className='flex flex-col gap-2 mt-2 text-sm p-[30px] border-[2px] border-[#4d8890]'>
//         <div className='flex justify-between text-white text-[18px] p-[10px]'>
//             <p>Sub Total</p>
//             <p>{currency} {getCartAmount()}.00</p> 
//         </div>
//         <hr/>
//         <div className='flex justify-between text-white text-[18px] p-[10px]'>
//             <p>Shipping Fees</p>
//             <p>{currency} {delivery_fee}.00</p> 
//         </div>
//         <hr/>
//         <div className='flex justify-between text-white text-[18px] p-[10px]'>
//             <p className='font-bold'>Total Amount</p>
//             <p className='font-semibold'>{currency} {getCartAmount()===0?0:getCartAmount()+delivery_fee}</p> 
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CartTotal;


import React, { useContext } from "react";
import { shopDataContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } =
    useContext(shopDataContext);

  return (
    <div className="w-full">
      <Title text1="CART" text2="TOTAL" />
      <div className="mt-4 border border-[#4d8890] rounded-lg p-6 space-y-4 text-white">
        <div className="flex justify-between text-lg">
          <p>Sub Total</p>
          <p>{currency} {getCartAmount()}.00</p>
        </div>
        <div className="flex justify-between text-lg">
          <p>Shipping Fees</p>
          <p>{currency} {delivery_fee}.00</p>
        </div>
        <hr />
        <div className="flex justify-between text-lg font-semibold">
          <p>Total Amount</p>
          <p>{currency} {getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}</p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
