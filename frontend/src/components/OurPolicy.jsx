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

        <div className="text-center mb-10">
          <Title text1="Our" text2="Policy" />
          <p className="text-blue-100 text-sm md:text-lg max-w-2xl mx-auto">
            Customer-friendly policies committed to your satisfaction and safety
          </p>
        </div>

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
