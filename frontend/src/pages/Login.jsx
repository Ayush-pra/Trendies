import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/Firebase';
import { userDataContext } from '../context/UserContext';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [loading, setloading] = useState(false);
      const {serverUrl} = useContext(authDataContext);
      const {getCurrentUser, setUserData} = useContext(userDataContext);
      // const handleSignin = async (e)=>{
      //   e.preventDefault();
      //   try{
      //     setloading(true);
      //     const result = await axios.post(serverUrl + "/api/auth/login", {
      //       email, password
      //     }, {withCredentials:true});
      //     // getCurrentUser();
          
      //     navigate("/");
      //     setloading(false);
      //     toast.success("Login Successfully");
      //     console.log(result.data);
      //   }
      //   catch{
      //     console.log("email or password is wrong")
      //     toast.error("Login Error");
      //   }
      // }
      const handleSignin = async (e) => {
          e.preventDefault();
          try {
            setloading(true);
      
            await axios.post(
              `${serverUrl}/api/auth/login`,
              { email, password },
              { withCredentials: true }
            );
      
            await getCurrentUser();
            toast.success("Login successful");
            navigate("/");
          } catch (error) {
            console.log(error);
            toast.error("Login failed");
          } finally {
            setloading(false);
          }
        };
  
      const googleSignin = async ()=>{
        try{
            setloading(true);
            const res = await signInWithPopup(auth, provider)
            const user = res.user;
            const name = user.displayName;
            const email = user.email;

            const result = await axios.post(serverUrl + "/api/auth/googlelogin", {
                name,email
            }, {withCredentials:true});
            setUserData({ name, email });
            await getCurrentUser();
            setloading(false);
            navigate("/");
            toast.success("Login Successfully");
            console.log(result.data);
        }
        catch{
            console.log("Google Login error");
            toast.error("Google-signin error");
        }
    }

    return (
        <>
            <div className='w-[100vw] h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-white flex flex-col items-center justify-start'>
                {/* Header */}
                <div 
                    className='w-[100%] h-[80px] flex items-center justify-start px-[30px] gap-[10px] cursor-pointer' 
                    onClick={() => { navigate("/") }}
                >
                    <img className='w-[40px]' src="/image/logo.png" alt="logo" />
                    <h1 className='text-[24px] font-sans'>Trendies</h1>
                </div>

                {/* Title */}
                <div className='w-[100%] h-[100px] flex items-center justify-center flex-col gap-[10px]'>
                    <p className='inline-block text-[25px] font-semibold mb-0'>Sign in Here</p>
                    <p className='inline-block text-[15px]'>Welcome to Trendies, Place Your Orders</p>
                </div>

                {/* Form Box */}
                <div className='max-w-[600px] w-[90%] h-[500px] bg-[#00000025] border-[1px] border-[#96969635] backdrop:blur-2xl rounded-lg shadow-lg flex items-center justify-center'>
                    <form onSubmit={handleSignin} action="" className="w-[90%] max-w-[600px] flex flex-col items-center gap-5 mt-5">
                        {/* Email Input */}
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full h-[50px] px-4 rounded-lg bg-[#1e2a2d] border border-[#3d5256] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#528a94] transition-all outline-none"
                            onChange={(e)=>setEmail(e.target.value)}
                            value={email}
                            required
                        />

                        {/* Password Input */}
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full h-[50px] px-4 rounded-lg bg-[#1e2a2d] border border-[#3d5256] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#528a94] transition-all outline-none"
                            onChange={(e)=>setPassword(e.target.value)}
                            value={password}
                            required
                        />

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full h-[50px] bg-purple-600 rounded-lg flex items-center justify-center gap-2 cursor-pointer 
                                shadow-md hover:shadow-xl hover:bg-purple-800 transition-all duration-300 ease-in-out active:scale-95 text-white font-semibold"
                        >
                            {loading? <Loading/>: "Sign in"}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center w-full gap-2">
                            <hr className="flex-grow border-gray-600" />
                            <span className="text-gray-400 text-sm">OR</span>
                            <hr className="flex-grow border-gray-600" />
                        </div>

                        {/* Google Sign Up */}
                        <div 
                            className="w-full h-[50px] bg-white text-black rounded-lg flex items-center justify-center gap-2 cursor-pointer 
                                shadow-md hover:shadow-xl transition-all duration-300 ease-in-out hover:bg-blue-800"
                          onClick={googleSignin}
                        >
                            <img src="/image/google.png" alt="google" className="w-[25px] h-[25px] rounded-full" />
                            <span className="font-medium tracking-wide">Sign in with Google</span>
                        </div>

                        {/* Sign In Redirect */}
                        <p className='text-sm text-gray-300'>
                            No Account ?{" "}
                            <span 
                                className="text-blue-600 cursor-pointer hover:text-blue-800"
                                onClick={() => navigate("/registration")}
                            >
                                Create account
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login


// import React, { useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { signInWithPopup } from "firebase/auth";
// import { auth, provider } from "../../utils/Firebase";
// import { authDataContext } from "../context/AuthContext";
// import { userDataContext } from "../context/UserContext";
// import Loading from "../components/Loading";
// import { toast } from "react-toastify";

// const Login = () => {
//   const navigate = useNavigate();
//   const { serverUrl } = useContext(authDataContext);
//   const { getCurrentUser, setUserData } = useContext(userDataContext);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   /* ===== Normal Login ===== */
//   const handleSignin = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);

//       await axios.post(
//         `${serverUrl}/api/auth/login`,
//         { email, password },
//         { withCredentials: true }
//       );

//       await getCurrentUser();
//       toast.success("Login successful");
//       navigate("/");
//     } catch (error) {
//       console.log(error);
//       toast.error("Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ===== Google Login ===== */
//   const googleSignin = async () => {
//     try {
//       setLoading(true);

//       const res = await signInWithPopup(auth, provider);
//       const user = res.user;

//       await axios.post(
//         `${serverUrl}/api/auth/googlelogin`,
//         {
//           name: user.displayName,
//           email: user.email,
//         },
//         { withCredentials: true }
//       );

//       setUserData({ name: user.displayName, email: user.email });
//       await getCurrentUser();

//       toast.success("Google login successful");
//       navigate("/");
//     } catch (error) {
//       console.log(error);
//       toast.error("Google login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
//       <form
//         onSubmit={handleSignin}
//         className="w-[400px] p-6 bg-gray-900 rounded-lg flex flex-col gap-4"
//       >
//         <h2 className="text-xl font-bold text-center">Login</h2>

//         <input
//           type="email"
//           placeholder="Email"
//           className="p-2 rounded bg-gray-800"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="p-2 rounded bg-gray-800"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button className="bg-purple-600 p-2 rounded">
//           {loading ? <Loading /> : "Login"}
//         </button>

//         <button
//           type="button"
//           onClick={googleSignin}
//           className="bg-white text-black p-2 rounded"
//         >
//           Login with Google
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;
