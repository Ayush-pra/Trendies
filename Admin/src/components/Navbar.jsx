import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authDataContext } from '../../context/AuthContext';
import { adminDataContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import Loading from './Loading';

const Navbar = () => {
  let navigate = useNavigate();
  const {serverUrl} = useContext(authDataContext);
  const {getAdmin} = useContext(adminDataContext);
  const [loading, setloading] = useState(false);
  const logout = async()=>{
    try{
      setloading(true);
      const result = await axios.get(serverUrl + "/api/auth/logout", {withCredentials:true});
      await getAdmin();
      navigate("/login");
      setloading(false);
      toast.success("Logout Successfully")
    }
    catch{
      toast.error("adminn logout error")
    }
  }

  return (
    <div className='w-[100vw] h-[70px] bg-[#020617]/90 z-20 fixed top-0 flex items-center justify-between px-[30px] shadow-md shadow-black'>
        <div className='w-[30%] flex items-center justify-start gap-[10px]'>
            <img src="/image/logo.png" alt="" className='w-[30px]'/>
            <h1 className='text-[25px] cursor-pointer text-white font-sans font-semibold'>Trendies</h1>
        </div>
        <button className='text-[16px] hover:border-[2px] border-[#89daea] cursor-pointer bg-amber-600 py-[8px] px-[20px] rounded-2xl text-white' onClick={()=>{logout()}}>{loading? <Loading/>: "Logout"}</button>
    </div>
  );
}

export default Navbar;
