import React from 'react'
import { FaCircle } from "react-icons/fa";


// const Hero = ({ heroData, heroCount, setheroCount }) => {
//   return (
//     <div className="relative w-full h-full z-10">
//       {/* Text */}
//       <div className="absolute text-[#88d9ee] text-[20px] md:text-[40px] lg:text-[55px] 
//                 md:left-[10%] md:top-[90px] lg:top-[130px] left-[10%] top-[10px] font-bold">
//         <p className="leading-tight">{heroData.text1}</p>
//         <p className="leading-tight bg-gradient-to-r from-orange-300 to-amber-400 bg-clip-text text-transparent">
//           {heroData.text2}
//         </p>
//       </div>

//       {/* Circles */}
//       <div className="absolute md:top-[400px] lg:top-[500px] top-[160px] left-[10%] flex items-center justify-center gap-[10px]">
//         {[0, 1, 2, 3].map((index) => (
//           <button
//             key={index}
//             className={`w-[14px] h-[14px] rounded-full cursor-pointer transition-all duration-300 ${
//               heroCount === index ? "bg-orange-400 shadow-lg shadow-orange-400/50" : "bg-white/70 hover:bg-white"
//             }`}
//             onClick={() => setheroCount(index)}
//           />
//         ))}
//       </div>
//     </div>
//   )
// }

const Hero = ({ heroData, heroCount, setheroCount }) => {
  return (
    <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-16">

      {/* Text */}
      <div className="mt-24 py-[40px] md:mt-0">
        {/* text-[#88d9ee] */}
        <p className="text-xl sm:text-3xl md:text-5xl font-bold text-gray-200">
          {heroData.text1}
        </p>
        <p className="text-xl sm:text-3xl md:text-5xl font-bold 
                       bg-gradient-to-r from-orange-400 to-amber-600 
                       bg-clip-text text-transparent">
          {heroData.text2}
        </p>
      </div>

      {/* Dots */}
      <div className="flex gap-3 mt-10">
        {[0,1,2,3].map(i => (
          <button
            key={i}
            onClick={() => setheroCount(i)}
            className={`w-3 h-3 rounded-full transition ${
              heroCount === i ? "bg-orange-400" : "bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};



export default Hero
