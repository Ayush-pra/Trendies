// import React from 'react'
// import Title from './Title'

// const OurPolicy = () => {
//     return (
//         <div className='w-[100vw] h-[100vh] md:h-[70vh] flex items-center justify-start flex-col bg-gradient-to-l from-[#141414] to-[#0c2025] gap-[50px]'>
//             <div className='h-[8%] w-[100%] text-center mt-[70px]'>
//                 <Title text1={"Our"} text2={"Policy"} />
//                 <p className='w-[100%] m-auto text-[13px] md:text-[20px] px-[10px] text-blue-300'>
//                     Customer Friendly Policies - Committed to Your Satisfaction and Safety
//                 </p>
//             </div>

//             {/* Policies Section */}
//             <div className='w-[100%] md:min-h-[50%] h-[20%] flex items-center justify-center flex-wrap lg:gap-[50px] gap-10 mt-10'>

//                 {/* Policy 1 */}
//                 <div className='flex flex-col items-center text-center w-[250px] p-4 rounded-2xl bg-[#1a2c30] shadow-md hover:scale-105 transition'>
//                     <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-blue-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     <h3 className="text-lg font-semibold text-white">Customer Satisfaction</h3>
//                     <p className="text-sm text-gray-300 mt-2">We prioritize your happiness with hassle-free support and friendly policies.</p>
//                 </div>

//                 {/* Policy 2 */}
//                 <div className='flex flex-col items-center text-center w-[250px] p-4 rounded-2xl bg-[#1a2c30] shadow-md hover:scale-105 transition'>
//                     <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-green-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-3.866 3.134-7 7-7h1v14h-1c-3.866 0-7-3.134-7-7zm-8 0c0-3.866 3.134-7 7-7h1v14h-1c-3.866 0-7-3.134-7-7z" />
//                     </svg>
//                     <h3 className="text-lg font-semibold text-white">Transparency</h3>
//                     <p className="text-sm text-gray-300 mt-2">Clear policies with no hidden terms, ensuring full trust and confidence.</p>
//                 </div>

//                 {/* Policy 3 */}
//                 <div className='flex flex-col items-center text-center w-[250px] p-4 rounded-2xl bg-[#1a2c30] shadow-md hover:scale-105 transition'>
//                     <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-20 text-yellow-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 16v-2m8-8h2m-2 0h-2m-6 6a6 6 0 100-12 6 6 0 000 12z" />
//                     </svg>
//                     <h3 className="text-lg font-semibold text-white">Safety & Security</h3>
//                     <p className="text-sm text-gray-300 mt-2">Your safety is our top priority with secure transactions and services.</p>
//                 </div>

//                 {/* Policy 4 */}
//                 <div className='flex flex-col items-center text-center w-[250px] p-4 rounded-2xl bg-[#1a2c30] shadow-md hover:scale-105 transition'>
//                     <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-purple-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v16c0 1.1.9 2 2 2h12a2 2 0 002-2V4m-6 0v4m-4-4v4M4 8h16" />
//                     </svg>
//                     <h3 className="text-lg font-semibold text-white">Easy Returns</h3>
//                     <p className="text-sm text-gray-300 mt-2">Simple and quick return process to make your shopping experience stress-free.</p>
//                 </div>

//                 {/* Policy 5 */}
//                 <div className='flex flex-col items-center text-center w-[250px] p-4 rounded-2xl bg-[#1a2c30] shadow-md hover:scale-105 transition'>
//                     <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-1.414 1.414a9 9 0 11-12.728 0L2.808 5.636m18.364 0A9.953 9.953 0 0021 12a9.953 9.953 0 00-.828 4.364l-1.414-1.414" />
//                     </svg>
//                     <h3 className="text-lg font-semibold text-white">24/7 Support</h3>
//                     <p className="text-sm text-gray-300 mt-2">Always available to assist you anytime, anywhere with dedicated support.</p>
//                 </div>

//             </div>
//         </div>

//     )
// }

// export default OurPolicy

import React from 'react';
import Title from './Title';

const OurPolicy = () => {
  const policies = [
    {
      title: 'Customer Satisfaction',
      desc: 'We prioritize your happiness with hassle-free support and friendly policies.',
      color: 'text-blue-400',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0" />
        </svg>
      )
    },
    {
      title: 'Transparency',
      desc: 'Clear policies with no hidden terms, ensuring full trust and confidence.',
      color: 'text-green-400',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            d="M12 11c0-3.866 3.134-7 7-7h1v14h-1c-3.866 0-7-3.134-7-7zm-8 0c0-3.866 3.134-7 7-7h1v14h-1c-3.866 0-7-3.134-7-7z" />
        </svg>
      )
    },
    {
      title: 'Safety & Security',
      desc: 'Your safety is our top priority with secure transactions and services.',
      color: 'text-yellow-400',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            d="M12 6V4m0 16v-2m8-8h2m-2 0h-2m-6 6a6 6 0 100-12 6 6 0 000 12" />
        </svg>
      )
    },
    {
      title: 'Easy Returns',
      desc: 'Simple and quick return process to make your shopping experience stress-free.',
      color: 'text-purple-400',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            d="M4 4v16c0 1.1.9 2 2 2h12a2 2 0 002-2V4m-6 0v4m-4-4v4M4 8h16" />
        </svg>
      )
    },
    {
      title: '24/7 Support',
      desc: 'Always available to assist you anytime, anywhere with dedicated support.',
      color: 'text-red-400',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            d="M18.364 5.636l-1.414 1.414a9 9 0 11-12.728 0L2.808 5.636" />
        </svg>
      )
    }
  ];

  return (
    <section className="w-full bg-gradient-to-l from-[#131212] to-[#081619]">
      <div className="max-w-7xl mx-auto min-h-screen md:min-h-[70vh] px-4 py-16">

        {/* Title */}
        <div className="text-center mb-10">
          <Title text1="Our" text2="Policy" />
          <p className="text-blue-100 text-sm md:text-lg max-w-2xl mx-auto">
            Customer-friendly policies committed to your satisfaction and safety
          </p>
        </div>

        {/* Policies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {policies.map((policy, index) => (
            <div
              key={index}
              className="bg-[#1a2c30] rounded-2xl p-6 text-center 
                         hover:scale-105 transition-transform duration-300 
                         shadow-lg"
            >
              <div className={`flex justify-center mb-4 ${policy.color}`}>
                {policy.icon}
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">
                {policy.title}
              </h3>

              <p className="text-sm text-gray-300">
                {policy.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default OurPolicy;
