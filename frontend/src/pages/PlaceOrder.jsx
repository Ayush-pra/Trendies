// import React, { useContext, useState } from 'react'
// import Title from '../components/Title'
// import CartTotal from '../components/CartTotal';
// import { data, useNavigate } from 'react-router-dom';
// import { shopDataContext } from '../context/ShopContext';
// import { authDataContext } from '../context/authContext';
// import axios from 'axios';


// const PlaceOrder = () => {
//   const [method, setmethod] = useState("cod");
//   const { serverUrl } = useContext(authDataContext);
//   const navigate = useNavigate();
//   const { cartItem, setcartItem, getCartAmount, delivery_fee, products } = useContext(shopDataContext);
//   const [formdata, setformdata] = useState({
//     firstname: '',
//     lastname: '',
//     email: '',
//     address: '',
//     city: '',
//     state: '',
//     pincode: '',
//     country: '',
//     phone: ''
//   });



//   const onChangehandler = (e) => {
//     const name = e.target.name;
//     const value = e.target.value;
//     setformdata(data => ({ ...data, [name]: value }));
//   }

//   const initpay = (order) => {
//     // NOTE: Use import.meta.env.VITE_ for React/Vite frontend keys
//     const options = {
//       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//       amount: order.amount,
//       currency: order.currency,
//       name: 'Your E-commerce Shop', // Use your shop name
//       description: 'Order Payment',
//       order_id: order.id, // Use order.id returned from your backend

//       // 1. THIS HANDLER IS CALLED ONLY AFTER SUCCESSFUL PAYMENT
//       handler: async (response) => {
//         console.log("Payment successful, verifying with backend:", response);

//         try {
//           // Send payment success response back to the backend for cryptographic verification
//           // Change this line:
//           // const {verificationResult} = await axios.post(
//           // ...

//           // To this (destructure 'data' from the axios response):
//           const { data } = await axios.post(
//             serverUrl + '/api/order/verifyRazorpay', response,
//             { withCredentials: true }
//           );

//           // Now, check the message property from the 'data' object
//           if (data.message === 'Payment Successful') { // Use the exact message from your backend
//             // 2. SUCCESS: Clear data and navigate
//             navigate("/order")
//             setcartItem({})
//           } else {
//             // Handle verification failure (e.g., alert the user)
//             alert("Payment verification failed. Please contact support.");
//             console.error("Verification failed:", data.message); // Log the actual failure message
//           }
//         } catch (error) {
//           console.error("Verification API call failed:", error);
//           alert("A critical error occurred during payment verification. Please contact support.");
//         }
//       },

//       // Optional UX features
//       prefill: {
//         name: formdata.firstname + " " + formdata.lastname,
//         email: formdata.email,
//         contact: formdata.phone,
//       },
//       theme: {
//         color: "#3498db"
//       }
//     };

//     if (window.Razorpay) {
//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } else {
//       alert("Razorpay script not loaded. Check your index.html.");
//     }
//   }



//   const onSubmithandler = async (e) => {
//     e.preventDefault();
//     try {
//       let orderItems = [];
//       for (const items in cartItem) {
//         for (const item in cartItem[items]) {
//           if (cartItem[items][item] > 0) {
//             const iteminfo = structuredClone(products.find(product => product._id === items))
//             if (iteminfo) {
//               iteminfo.size = item
//               iteminfo.quantity = cartItem[items][item]
//               orderItems.push(iteminfo);
//             }
//           }
//         }
//       }
//       let orderData = {
//         address: formdata,
//         items: orderItems,
//         amount: getCartAmount() + delivery_fee
//       }
//       switch (method) {
//         case 'cod':
//           const result = await axios.post(serverUrl + '/api/order/placeorder', orderData, { withCredentials: true });
//           console.log(result.data);
//           if (result.data) {
//             setformdata({
//               firstname: '',
//               lastname: '',
//               email: '',
//               address: '',
//               city: '',
//               state: '',
//               pincode: '',
//               country: '',
//               phone: ''
//             });
//             setcartItem({});
//             navigate("/order");
//           }

//           break;

//         case 'razorpay':
//           const resultRazorpay = await axios.post(serverUrl + "/api/order/razorpay", orderData, { withCredentials: true });
//           if (resultRazorpay.data) {
//             initpay(resultRazorpay.data);
//           }
//           break;
//         default:
//           break;
//       }

//     }
//     catch (error) {
//       console.log(error);
//     }
//   }
//   return (
//     <div className='w-[100vw] h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex items-center justify-center flex-col md:flex-row gap-[50px] relative'>
//       <div className='lg:w-[50%] w-[100%] h-[100%] flex items-center justify-center lg:mt-[0px] mt-[90px]'>
//         <form action="" onSubmit={onSubmithandler} className='lg:w-[70%] w-[95%] lg:h-[70%] h-[100%]'>
//           <div className='py-[10px]'>
//             <Title text1={"DELIVERY"} text2={"INFORMATION"} />
//           </div>
//           <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
//             <input type="text" placeholder='firstname' className='w-[48%] h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px] shadow-sm shadow-[#343434]' required
//               onChange={onChangehandler} name='firstname' value={formdata.firstname} />
//             <input type="text" placeholder='lastname' className='w-[48%] h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px] shadow-sm shadow-[#343434]' required
//               onChange={onChangehandler} name='lastname' value={formdata.lastname} />
//           </div>
//           <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
//             <input type="text" placeholder='email' className='w-[100%] h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px] shadow-sm shadow-[#343434]' required
//               onChange={onChangehandler} name='email' value={formdata.email} />
//           </div>
//           <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
//             <input type="text" placeholder='address' className='w-[100%] h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px] shadow-sm shadow-[#343434]' required
//               onChange={onChangehandler} name='address' value={formdata.address} />
//           </div>
//           <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
//             <input type="text" placeholder='city' className='w-[48%] h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px] shadow-sm shadow-[#343434]' required
//               onChange={onChangehandler} name='city' value={formdata.city} />
//             <input type="text" placeholder='state' className='w-[48%] h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px] shadow-sm shadow-[#343434]' required
//               onChange={onChangehandler} name='state' value={formdata.state} />
//           </div>
//           <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
//             <input type="text" placeholder='pincode' className='w-[48%] h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px] shadow-sm shadow-[#343434]' required
//               onChange={onChangehandler} name='pincode' value={formdata.pincode} />
//             <input type="text" placeholder='country' className='w-[48%] h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px] shadow-sm shadow-[#343434]' required
//               onChange={onChangehandler} name='country' value={formdata.country} />
//           </div>
//           <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
//             <input type="number" placeholder='phone' className='w-[100%] h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px] shadow-sm shadow-[#343434]' required
//               onChange={onChangehandler} name='phone' value={formdata.phone} />
//           </div>
//           <div>
//             <button type='submit' className='text-[18px] bg-blue-700 hover:bg-blue-600 cursor-pointer bg-[#3bcee848 py-[10px] px-[50px] rounded-2xl text-white flex items-center justify-center gap-[20px] absolute lg:right-[20%] button-[10%] right-[35%] border-[1px] border-[#80808049] ml-[30px] mt-[20px]'>Plce Order</button>
//           </div>
//         </form>
//       </div>
//       <div className='lg:w-[50%] w-[100%] min-h-[100%] flex items-center justify-center gap-[30px]'>
//         <div className='lg:w-[70%] w-[90%] lg:h-[70%] h-[100%] flex items-center justify-center gap-[10px] flex-col'>
//           <CartTotal />
//           <Title text1={"PAYMENT"} text2={"METHOD"} />
//           <div className='w-[100%] h-[30vh] lg:h-[100px] flex items-start mt-[20px] lg:mt-[0px] justify-center gap-[50px]'>
//             <button onClick={() => setmethod('razorpay')} className={`w-[150px] h-[50px] rounded-sm ${method === 'razorpay' ? 'border-[5px] border-blue-900 rounded-sm' : ''}`}>
//               <img src="/image/razorpay.png" alt="" className='w-[100%] h-[100%] bg-gradient-to-t from-[#95b3f8] to-[white] border-5 border-zinc-300 object-fill rounded-sm' />
//             </button>
//             <button onClick={() => setmethod('cod')} className={`w-[200px] h-[50px] bg-gradient-to-t from-[#95b3f8] to-[white] text-[14px] px-[20px] rounded-sm text-[#332f6f] font-bold ${method === 'cod' ? 'border-[5px] border-blue-900 rounded-sm' : ''}`}>CASH ON DELIVERY</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default PlaceOrder


import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { useNavigate } from "react-router-dom";
import { shopDataContext } from "../context/ShopContext";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";

const PlaceOrder = () => {
  const [method, setmethod] = useState("cod");
  const { serverUrl } = useContext(authDataContext);
  const navigate = useNavigate();
  const { cartItem, setcartItem, getCartAmount, delivery_fee, products } =
    useContext(shopDataContext);

  const [formdata, setformdata] = useState({
    firstname: "",
    lastname: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    phone: "",
  });

  const onChangehandler = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const initpay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Your E-commerce Shop",
      description: "Order Payment",
      order_id: order.id,
      handler: async (response) => {
        const { data } = await axios.post(
          serverUrl + "/api/order/verifyRazorpay",
          response,
          { withCredentials: true }
        );
        if (data.message === "Payment Successful") {
          navigate("/order");
          setcartItem({});
        }
      },
      prefill: {
        name: formdata.firstname + " " + formdata.lastname,
        email: formdata.email,
        contact: formdata.phone,
      },
      theme: { color: "#3498db" },
    };
    new window.Razorpay(options).open();
  };

  const onSubmithandler = async (e) => {
    e.preventDefault();
    let orderItems = [];

    for (const items in cartItem) {
      for (const item in cartItem[items]) {
        if (cartItem[items][item] > 0) {
          const product = structuredClone(
            products.find((p) => p._id === items)
          );
          product.size = item;
          product.quantity = cartItem[items][item];
          orderItems.push(product);
        }
      }
    }

    const orderData = {
      address: formdata,
      items: orderItems,
      amount: getCartAmount() + delivery_fee,
    };

    if (method === "cod") {
      await axios.post(
        serverUrl + "/api/order/placeorder",
        orderData,
        { withCredentials: true }
      );
      setcartItem({});
      navigate("/order");
    }

    if (method === "razorpay") {
      const res = await axios.post(
        serverUrl + "/api/order/razorpay",
        orderData,
        { withCredentials: true }
      );
      initpay(res.data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] px-4 md:px-10 py-24">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">
        <form
          onSubmit={onSubmithandler}
          className="bg-[#1e2b2f] rounded-xl p-6 space-y-4"
        >
          <Title text1="DELIVERY" text2="INFORMATION" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="firstname" placeholder="First Name" required className="input" onChange={onChangehandler} />
            <input name="lastname" placeholder="Last Name" required className="input" onChange={onChangehandler} />
          </div>

          <input name="email" placeholder="Email" required className="input" onChange={onChangehandler} />
          <input name="address" placeholder="Address" required className="input" onChange={onChangehandler} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="city" placeholder="City" required className="input" onChange={onChangehandler} />
            <input name="state" placeholder="State" required className="input" onChange={onChangehandler} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="pincode" placeholder="Pincode" required className="input" onChange={onChangehandler} />
            <input name="country" placeholder="Country" required className="input" onChange={onChangehandler} />
          </div>

          <input name="phone" placeholder="Phone" required className="input" onChange={onChangehandler} />

          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold">
            Place Order
          </button>
        </form>

        <div className="bg-[#1e2b2f] rounded-xl p-6 space-y-6">
          <CartTotal />
          <Title text1="PAYMENT" text2="METHOD" />

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setmethod("razorpay")}
              className={`payment-btn ${method === "razorpay" ? "active" : ""}`}
            >
              <img src="/image/razorpay.png" className="payment-icon" />
            </button>

            <button
              onClick={() => setmethod("cod")}
              className={`payment-btn ${method === "cod" ? "active" : ""}`}
            >
              <span className="payment-text">Cash on Delivery</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
