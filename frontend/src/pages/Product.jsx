import React from 'react'
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';

const Product = () => {
  return (
    // <div className='w-full bg-gradient-to-l from-[#141414] to-[#0c2025] min-h-screen flex flex-col items-center justify-start py-10'>
    //   {/* Latest Collection */}
    //   <div className='w-full flex items-center justify-center'>
    //     <LatestCollection/>
    //   </div>

    //   {/* Best Seller */}
    //   <div className='w-full flex items-center justify-center mt-10'>
    //     <BestSeller/>
    //   </div>
    // </div>
    <div className="w-full bg-gradient-to-l from-[#040404] to-[#050c0e] py-14">
      <LatestCollection />
      <BestSeller />
    </div>
  )
}

// const Product = () => {
//     return (
//         <div className='w-full bg-slate-950 min-h-screen flex flex-col items-center justify-start py-10'>
//             <LatestCollection/>
//             <BestSeller/>
//         </div>
//     );
// };

export default Product;
