import React, { useContext, useEffect, useState, useRef } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { useNavigate } from "react-router-dom";
import { shopDataContext } from "../context/ShopContext";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const [method, setmethod] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { serverUrl } = useContext(authDataContext);
  const { userData, authLoading } = useContext(userDataContext);
  const navigate = useNavigate();
  const { cartItem, setcartItem, getCartAmount, delivery_fee, cartProducts } =
    useContext(shopDataContext);

  // Generate idempotency key once when the checkout page loads.
  // useRef ensures it survives re-renders but does NOT regenerate on every click.
  const idempotencyKeyRef = useRef(crypto.randomUUID());

  useEffect(() => {
    if (!authLoading && !userData) {
      navigate("/login");
    }
  }, [authLoading, userData]);

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
      modal: {
        ondismiss: async () => {
          // User closed the Razorpay modal without paying — cancel the order and release stock
          try {
            await axios.post(
              serverUrl + "/api/order/cancelrazorpay",
              { razorpay_order_id: order.id },
              { withCredentials: true }
            );
            toast.info("Payment cancelled. Your order has been removed.");
          } catch (err) {
            console.error("Cancel order error:", err);
          }
          // Regenerate the idempotency key so the user can place a new order
          idempotencyKeyRef.current = crypto.randomUUID();
          setIsLoading(false);
        },
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

    if (isLoading) return;

    if (!method) {
      toast.warn("Please select a payment method");
      return;
    }

    setIsLoading(true);

    let orderItems = [];

    for (const items in cartItem) {
      for (const item in cartItem[items]) {
        if (cartItem[items][item] > 0) {
          const foundProduct = cartProducts.find((p) => p._id === items);
          if (!foundProduct) continue;
          const product = structuredClone(foundProduct);
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
      try {
        const response = await axios.post(
          serverUrl + "/api/order/placeorder",
          orderData,
          { withCredentials: true, headers: { "Idempotency-Key": idempotencyKeyRef.current } }
        );
        if (response.data.failedItems && response.data.failedItems.length > 0) {
          toast.warn(response.data.message);
        } else {
          toast.success(response.data.message);
        }
        setcartItem({});
        setIsLoading(false);
        // Regenerate key after successful order so the next order gets a fresh key
        idempotencyKeyRef.current = crypto.randomUUID();
        navigate("/order");
      } catch (err) {
        setIsLoading(false);
        if (err.response?.status === 409) {
          toast.error(err.response.data.message);
          if (err.response.data.failedItems) {
            let updatedCart = structuredClone(cartItem);
            err.response.data.failedItems.forEach((item) => {
              if (updatedCart[item._id]) {
                delete updatedCart[item._id][item.size];
                if (Object.keys(updatedCart[item._id]).length === 0) {
                  delete updatedCart[item._id];
                }
              }
            });
            setcartItem(updatedCart);
          }
        } else {
          const msg = err.response?.data?.message || "Order failed. Please try again.";
          toast.error(msg);
        }
      }
    }

    if (method === "razorpay") {
      try {
        const res = await axios.post(
          serverUrl + "/api/order/razorpay",
          orderData,
          { withCredentials: true, headers: { "Idempotency-Key": idempotencyKeyRef.current } }
        );
        if (res.data.failedItems && res.data.failedItems.length > 0) {
          const failedNames = res.data.failedItems.map(i => `${i.name} (Size: ${i.size})`).join(', ');
          toast.warn(`Note: ${failedNames} were removed as they are out of stock.`);
        }
        setIsLoading(false);
        initpay(res.data);
      } catch (err) {
        setIsLoading(false);
        if (err.response?.status === 409) {
          toast.error(err.response.data.message);
          if (err.response.data.failedItems) {
            let updatedCart = structuredClone(cartItem);
            err.response.data.failedItems.forEach((item) => {
              if (updatedCart[item._id]) {
                delete updatedCart[item._id][item.size];
                if (Object.keys(updatedCart[item._id]).length === 0) {
                  delete updatedCart[item._id];
                }
              }
            });
            setcartItem(updatedCart);
          }
        } else {
          const msg = err.response?.data?.message || "Order failed. Please try again.";
          toast.error(msg);
        }
      }
    }
  };

  return (
    <form onSubmit={onSubmithandler} className="min-h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] px-3 sm:px-4 md:px-10 py-20 sm:py-24">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6 sm:gap-10">

        {/* Left Column: Delivery Information */}
        <div className="bg-[#1e2b2f] rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4">
          <Title text1="DELIVERY" text2="INFORMATION" />

          <div className="grid grid-cols-2 gap-3">
            <input name="firstname" placeholder="First Name" required className="input" onChange={onChangehandler} />
            <input name="lastname" placeholder="Last Name" required className="input" onChange={onChangehandler} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input name="email" placeholder="Email" required className="input" onChange={onChangehandler} />
            <input name="phone" placeholder="Phone" required className="input" onChange={onChangehandler} />
          </div>

          <input name="address" placeholder="Address" required className="input" onChange={onChangehandler} />

          <div className="grid grid-cols-2 gap-3">
            <input name="city" placeholder="City" required className="input" onChange={onChangehandler} />
            <input name="state" placeholder="State" required className="input" onChange={onChangehandler} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input name="pincode" placeholder="Pincode" required className="input" onChange={onChangehandler} />
            <input name="country" placeholder="Country" required className="input" onChange={onChangehandler} />
          </div>
        </div>

        {/* Right Column: Order Summary, Payment, and Submit */}
        <div className="bg-[#1e2b2f] rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6 flex flex-col justify-between">
          <div className="space-y-4 sm:space-y-6">
            <CartTotal />
            <Title text1="PAYMENT" text2="METHOD" />

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setmethod("razorpay")}
                className={`payment-btn ${method === "razorpay" ? "active" : ""}`}
              >
                <img src="/image/razorpay.png" className="payment-icon" />
              </button>

              <button
                type="button"
                onClick={() => setmethod("cod")}
                className={`payment-btn ${method === "cod" ? "active" : ""}`}
              >
                <span className="payment-text">Cash on Delivery</span>
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className={`w-full py-3.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold text-sm sm:text-base mt-6 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {isLoading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>

      </div>
    </form>
  );
};

export default PlaceOrder;
