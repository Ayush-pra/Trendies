import React from 'react';

const Title = ({text1, text2}) => {
  return (
    <div className='inline-flex gap-2 items-center text-center mb-3 text-[35px]'>
        <p className='text-white font-semibold'>{text1}<span className='text-amber-600 font-semibold'> {text2}</span></p>
    </div>
  );
}

export default Title;
