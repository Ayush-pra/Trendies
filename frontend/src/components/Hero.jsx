import React from 'react'
import { FaCircle } from "react-icons/fa";

const Hero = ({ heroData, heroCount, setheroCount }) => {
  return (
    <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-16">
      <div className="mt-24 py-[40px] md:mt-0">
        <p className="text-xl sm:text-3xl md:text-5xl font-bold text-gray-200">
          {heroData.text1}
        </p>
        <p className="text-xl sm:text-3xl md:text-5xl font-bold 
                       bg-gradient-to-r from-orange-400 to-amber-600 
                       bg-clip-text text-transparent">
          {heroData.text2}
        </p>
      </div>
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
