import React, { useContext } from 'react'
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom';

const Card = ({ name, image, price, id }) => {
  const { currency } = useContext(shopDataContext);
  const navigate = useNavigate();
  return (
    <div className='w-full bg-[#ffffff0a] backdrop-blur-lg rounded-lg hover:scale-[102%] transform transition duration-200 flex flex-col p-3 cursor-pointer border border-[#80808049]' onClick={()=>navigate(`/productdetail/${id}`)}>
      <div className='w-full h-64 bg-white rounded-sm overflow-hidden'>
        <img src={image} alt={name} className='w-full h-full object-cover' />
      </div>

      <div className='mt-3 text-[#c3f6fa] text-[18px] truncate'>{name}</div>
      <div className='text-[#f3fafa] text-[14px] mt-1'>{currency}{price}</div>
    </div>
  )
}

export default Card
