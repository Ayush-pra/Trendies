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
