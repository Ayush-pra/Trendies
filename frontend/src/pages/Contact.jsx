import React from 'react';
import Footer from '../components/Footer';
import NewsLetterBox from '../components/NewsLetterBox'; 
import Title from '../components/Title'; // Imported the reusable title component

const ContactUs = () => {
  return (
    <div className='w-full min-h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] pt-[73px]'>
      <div className='max-w-6xl mx-auto py-16 px-6 lg:px-8'>
        <div className='text-center mb-12'>
          <div className='flex justify-center'>
            <Title text1="Get In" text2="Touch" />
          </div>
          <p className='text-xl text-white/70 max-w-3xl mx-auto'>
            We're here to help! Send us a message or find our details below.
          </p>
        </div>

        <div className='grid lg:grid-cols-3 gap-10'>
          <div className='lg:col-span-2 p-8 rounded-xl bg-[#141414] shadow-2xl border border-[#0c2025]'>
            <h2 className='text-3xl font-bold mb-6 bg-gradient-to-r from-orange-300 to-amber-400 bg-clip-text text-transparent'>
              Send Us a Message
            </h2>
            <form className='space-y-6'>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#88d9ee]">Full Name</label>
                <input type="text" id="name" name="name" required
                  className="mt-1 block w-full px-4 py-3 border border-slate-700 rounded-md 
                  bg-[#0c2025] text-white focus:ring-orange-400 focus:border-orange-400"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#88d9ee]">Email Address</label>
                <input type="email" id="email" name="email" required
                  className="mt-1 block w-full px-4 py-3 border border-slate-700 rounded-md 
                  bg-[#0c2025] text-white focus:ring-orange-400 focus:border-orange-400"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#88d9ee]">Your Message</label>
                <textarea id="message" name="message" rows="4" required
                  className="mt-1 block w-full px-4 py-3 border border-slate-700 rounded-md 
                  bg-[#0c2025] text-white focus:ring-orange-400 focus:border-orange-400"
                ></textarea>
              </div>
              <button type="submit" 
                className='w-full px-6 py-3 text-lg font-semibold rounded-md 
                bg-orange-400 text-[#141414] hover:bg-orange-700 cursor-pointer transition-colors'>
                Submit Inquiry
              </button>
            </form>
          </div>
          <div className='lg:col-span-1 space-y-8 p-8 rounded-xl bg-[#141414] shadow-xl border border-[#0c2025] h-fit'>
            {/* Standard H2, maintaining the primary accent color */}
            <h2 className='text-3xl font-bold mb-4 text-[#88d9ee]'>
              Contact Information
            </h2>
            
            <div className='space-y-4'>
                <p className='text-white/80'>
                    <strong className='text-[#88d9ee] block mb-1'>Customer Support:</strong>
                    <a href="mailto:support@yourbrand.com" className='hover:text-orange-400'>support@yourbrand.com</a>
                </p>
                <p className='text-white/80'>
                    <strong className='text-[#88d9ee] block mb-1'>Phone:</strong>
                    <a href="tel:+1234567890" className='hover:text-orange-400'>(123) 456-7890</a>
                </p>
                <p className='text-white/80'>
                    <strong className='text-[#88d9ee] block mb-1'>Address:</strong>
                    123 Fashion Lane, Style City, SC 90210
                </p>
            </div>
          </div>
        </div>

      </div>
      
      <NewsLetterBox/> 
      <Footer />
    </div>
  );
};

export default ContactUs;
