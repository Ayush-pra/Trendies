import React, { useContext, useEffect, useState } from 'react'
import { shopDataContext } from '../context/ShopContext'
import Title from './Title';
import Card1 from './Card1';
import Card from './Card';

const RelatedProduct = ({category, subCategory, currentProductId}) => {
    const {products} = useContext(shopDataContext);
    const [related, setrelated] = useState([]);
    useEffect(()=>{
        if(products.length>0){
            let productCopy = products.slice();
            // Handle arrays or strings for related categories
            const matchCategories = Array.isArray(category) ? category : [category];
            const matchSubCategories = Array.isArray(subCategory) ? subCategory : [subCategory];

            productCopy=productCopy.filter((item)=> {
                const itemCats = Array.isArray(item.category) ? item.category : [item.category];
                return itemCats.some(c => matchCategories.includes(c));
            });
            productCopy=productCopy.filter((item)=> {
                const itemSubs = Array.isArray(item.subCategory) ? item.subCategory : [item.subCategory];
                return itemSubs.some(s => matchSubCategories.includes(s));
            });
            productCopy=productCopy.filter((item)=>currentProductId!==item._id);
            setrelated(productCopy.slice(0,4));
        }
    }, [products, category, subCategory, currentProductId]);
  return (
    <div className='my-[130px] md:my-[40px] md:px-[60px]'>
        <div className='w-[100%] mt-[30px] flex items-center justify-start flex-wrap gap-[30px]'>
            {
                related.map((item, index)=>(
                    <Card1 key={index} id={item._id} name={item.name} price={item.price} image={item.image1}/>
                ))
            }
        </div>
    </div>
  )
}

export default RelatedProduct
