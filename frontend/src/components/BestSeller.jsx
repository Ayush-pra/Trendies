import React, { useContext, useState, useEffect } from 'react';
import Title from './Title';
import { shopDataContext } from '../context/ShopContext';
import Card from './Card';
import Card1 from './Card1';

const BestSeller = () => {
  const { products } = useContext(shopDataContext);
  const [bestSeller, setbestSeller] = useState([]);
  useEffect(() => {
    const filterproduct = products.filter((item) => item.bestseller);
    setbestSeller(filterproduct.slice(0, 4));
  }, [products])
  return (
    <div>
      <div className='h-[8%] w-[100%] text-center mt-[50px]'>
        <Title text1={'BEST'} text2={'SELLER'}></Title>
        <p className='w-[100%] m-auto text-[20px] px-[10px] text-blue-100'>Tried, Tested, Loved Discover Our All-Time BestSeller</p>
      </div>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
        {
          bestSeller.map((item,index)=>(
            <Card1 key={index} name={item.name} id={item._id} price={item.price} image={item.image1}/>
          ))
        }
      </div>

    </div>
  );
}

export default BestSeller;
