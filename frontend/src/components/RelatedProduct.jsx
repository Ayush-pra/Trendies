import React, { useContext, useEffect, useState } from 'react'
import { authDataContext } from '../context/AuthContext'
import Title from './Title';
import Card1 from './Card1';
import axios from 'axios';

const RelatedProduct = ({category, subCategory, currentProductId}) => {
    const { serverUrl } = useContext(authDataContext);
    const [related, setrelated] = useState([]);
    
    useEffect(()=>{
        const fetchRelated = async () => {
            try {
                const params = new URLSearchParams();
                if (category) {
                    const matchCategories = Array.isArray(category) ? category : [category];
                    params.append('category', matchCategories.join(','));
                }
                if (subCategory) {
                    const matchSubCategories = Array.isArray(subCategory) ? subCategory : [subCategory];
                    params.append('subcategory', matchSubCategories.join(','));
                }
                params.append('limit', 5);

                const response = await axios.get(`${serverUrl}/api/product/catalog?${params.toString()}`);
                if (response.data.success) {
                    const filtered = response.data.products.filter(item => item._id !== currentProductId);
                    setrelated(filtered.slice(0, 4));
                }
            } catch (error) {
                console.error("Error fetching related products:", error);
            }
        };
        fetchRelated();
    }, [category, subCategory, currentProductId, serverUrl]);
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
