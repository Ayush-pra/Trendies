import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import Collection from '../pages/Collection'
import { shopDataContext } from '../context/ShopContext'
import Card from './Card'
import Card1 from './Card1'

const LatestCollection = () => {
    const { products } = useContext(shopDataContext);
    const [latestproduct, setlatestproduct] = useState([]);
    useEffect(() => {
        setlatestproduct(products.slice(0, 8));
    }, [products])
    return (
        <div>
            <div className='h-[15%] w-[100%] text-center md:mt-[50px]'><Title text1={"Latest"} text2={"Collections"} />
                <p className='w-[100%] m-auto text-[25px] px-[10px] text-blue-100'>Step into Style - New Collection Dropping This Season!!</p>
            </div>
            <div className='w-full mt-[30px] grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 px-2 sm:px-4'>
                {latestproduct.length === 0 ? (
                    <p className="text-gray-400 text-center col-span-full">No products available</p>
                ) : (
                    latestproduct.map((item, index) => (
                        <Card1 key={index} name={item.name} image={item.image1} id={item._id} price={item.price} />
                    ))
                )}
            </div>
        </div>
    )
}

export default LatestCollection
