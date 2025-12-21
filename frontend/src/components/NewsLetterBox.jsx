// import React from 'react'
// import Title from './Title'

// const NewsLetterBox = () => {
//   return (
//     <div className='w-[100%] h-[40vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex items-center justify-center gap-6 flex-col px-4'>
      
//       <Title text1={"Subscribe"} text2={"For Getting Updated"}/>

//       {/* Subtitle */}
//       <p className='text-gray-300 text-sm -mt-8 md:text-base max-w-[500px] text-center'>
//         Get the latest updates, offers, and news delivered straight to your inbox.
//       </p>

//       {/* Input + Button */}
//       <div className='flex w-full max-w-[500px] gap-2'>
//         <input 
//           type='email' 
//           placeholder='Enter your email' 
//           className='flex-1 px-4 py-2 rounded-l-lg outline-none text-white border-[1px] border-blue-100 rounded-lg'
//         />
//         <button className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition'>
//           Subscribe
//         </button>
//       </div>

//     </div>
//   )
// }

// export default NewsLetterBox


import React from 'react';
import Title from './Title';

const NewsLetterBox = () => {
  return (
    <section className="w-full bg-gradient-to-l from-[#141414] to-[#0c2025] py-16 px-4">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-6 text-center">

        {/* Title */}
        <Title text1="Subscribe" text2="For Getting Updated" />

        {/* Subtitle */}
        <p className="text-gray-300 text-sm md:text-base max-w-[500px] -mt-6">
          Get the latest updates, offers, and news delivered straight to your inbox.
        </p>

        {/* Input + Button */}
        <div className="flex flex-col sm:flex-row w-full max-w-[500px] gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="
              w-full px-4 py-3
              rounded-lg outline-none
              text-white bg-transparent
              border border-blue-300/40
              focus:border-blue-400
              placeholder-gray-400
            "
          />

          <button
            className="
              w-full sm:w-auto
              bg-blue-500 hover:bg-blue-600
              text-white font-medium
              px-6 py-3 rounded-lg
              transition-colors
            "
          >
            Subscribe
          </button>
        </div>

      </div>
    </section>
  );
};

export default NewsLetterBox;
