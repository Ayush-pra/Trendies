import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authDataContext } from '../../context/authContext';
import { adminDataContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';


const Login = () => {
    const [show, setshow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {serverUrl} = useContext(authDataContext);
    const {admindata, getAdmin} = useContext(adminDataContext);
    const [loading, setloading] = useState(false);
    const navigate = useNavigate();

    const AdminLogin = async (e)=>{
        try{
          setloading(true);
          e.preventDefault();
          const result = await axios.post(serverUrl + "/api/auth/adminlogin", {email, password}, {withCredentials:true});
          getAdmin();
          navigate("/");
          setloading(false);
          toast.success("Admin Login Successfully");
          console.log(result.data);
        }
        catch{
          console.log("error Admin login");
          toast.error("Admin Login error");
        }
    }
    return (
        <>
            <div className='w-[100vw] h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-white flex flex-col items-center justify-start'>
                {/* Header */}
                <div 
                    className='w-[100%] h-[80px] flex items-center justify-start px-[30px] gap-[10px] cursor-pointer'
                >
                    <img className='w-[40px]' src="/image/logo.png" alt="logo" />
                    <h1 className='text-[24px] font-sans'>Trendies</h1>
                </div>

                {/* Title */}
                <div className='w-[100%] h-[100px] flex items-center justify-center flex-col gap-[10px]'>
                    <p className='inline-block text-[25px] font-semibold mb-0'>Sign in Here</p>
                    <p className='inline-block text-[15px]'>Welcome to Trendies, Applt to Admin Login</p>
                </div>

                {/* Form Box */}
                <div className='max-w-[500px] w-[90%] h-[400px] bg-[#00000025] border-[1px] border-[#96969635] backdrop:blur-2xl rounded-lg shadow-lg flex pt-15 items-start justify-center'>
                    <form onSubmit={AdminLogin} action="" className="w-[90%] max-w-[600px] flex flex-col items-center gap-5 mt-5">
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

                    </form>
                </div>
            </div>
        </>
    );
}

export default Login
