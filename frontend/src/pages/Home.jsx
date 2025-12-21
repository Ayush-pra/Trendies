import React, { useEffect, useState } from 'react';
import Background from '../components/Background';
import Hero from '../components/Hero';
import Product from './Product';
import OurPolicy from '../components/OurPolicy';
import NewsLetterBox from '../components/NewsLetterBox';
import Footer from '../components/Footer';

const Home = () => {
    const [heroCount, setheroCount] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setheroCount(prevCount => (prevCount === 3 ? 0 : prevCount + 1))
      }, 4000); // Slightly slower for better UX
      return () => clearInterval(interval);
    }, []);

  const heroData = [
    { text1: "Discover", text2: "New Fashion" },
    { text1: "Trendy", text2: "Summer Wear" },
    { text1: "Elegant", text2: "Winter Styles" },
    { text1: "Exclusive", text2: "Collections" },
  ];

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero */}
      <div className="relative bg-gradient-to-l from-[#141414] to-[#0c2025] 
                      w-full min-h-[90vh] mt-[70px]">
        <Background heroCount={heroCount} />
        <Hero heroData={heroData[heroCount]} heroCount={heroCount} setheroCount={setheroCount} />
      </div>

      <Product />
      <OurPolicy />
      <NewsLetterBox />
      <Footer />
    </div>
  );
};


export default Home;
