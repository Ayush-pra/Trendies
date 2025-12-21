import React from 'react';
import Footer from '../components/Footer'; 
import OurPolicy from '../components/OurPolicy'; 
import Title from '../components/Title';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();
  return (
    <div className='w-full min-h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] pt-[73px]'>
      <div className='max-w-6xl mx-auto py-16 px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <div className='flex justify-center'>
             <Title text1="Our Story" text2="& Vision" />
          </div>
          <p className='text-xl text-white/70 max-w-3xl mx-auto'>
            Driven by passion, defined by style. Discover the journey of [Your Brand Name].
          </p>
        </div>
        <div className='grid md:grid-cols-2 gap-12 mb-16'>
          <div className='p-8 rounded-lg border border-[#0c2025] bg-[#141414] shadow-2xl'>
            <h2 className='text-3xl font-bold mb-4 bg-gradient-to-r from-orange-300 to-amber-400 bg-clip-text text-transparent'>
              Our Mission
            </h2>
            <p className='text-white/80 leading-relaxed'>
              To revolutionize everyday fashion by blending **timeless elegance** with modern, sustainable practices. We believe style shouldn't cost the earth, and quality should be accessible to all.
            </p>
          </div>
          <div className='p-8 rounded-lg border border-[#0c2025] bg-[#141414] shadow-2xl'>
            <h2 className='text-3xl font-bold mb-4 text-[#88d9ee]'>
              Our Values
            </h2>
            <ul className='list-disc list-inside text-white/80 leading-relaxed space-y-2'>
              <li>Innovation: Constantly seeking new styles and materials.</li>
              <li>Quality: Crafting durable, high-wear garments.</li>
              <li>Integrity: Transparent and ethical sourcing.</li>
              <li>Customer-Centricity: Style built around you.</li>
            </ul>
          </div>
        </div>
        <div className='text-center py-10'>
            <div className='flex justify-center'>
              {/* Using Title for a major section break */}
              <Title text1="Meet The" text2="Founders" />
            </div>
            <p className='text-white/70 max-w-4xl mx-auto'>
                A dedicated group of fashion enthusiasts who brought their vision to life. Their combined expertise in design and retail drives our success.
            </p>
            <button className='mt-8 px-8 py-3 text-lg font-semibold rounded-full 
              bg-orange-400 text-[#141414] cursor-pointer hover:bg-orange-700 transition-colors'
              onClick={() => navigate("/collection")}>
              Explore Our Collections
            </button>
        </div>

      </div>

      <OurPolicy /> 
      <Footer />
    </div>
  );
};

export default AboutUs;