import React from 'react'
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';

const Product = () => {
  return (
    <div className="w-full bg-gradient-to-l from-[#040404] to-[#050c0e] py-14">
      <LatestCollection />
      <BestSeller />
    </div>
  )
}
export default Product;
