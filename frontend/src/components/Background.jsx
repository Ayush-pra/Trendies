import React from 'react';

const Background = ({ heroCount }) => {
    const images = [
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80",
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=2005&q=80",
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    ];

    return (
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
            <div className="absolute inset-0 md:left-1/2 md:w-1/2">
                <img
                    src={images[heroCount]}
                    className="w-full h-full object-cover transition-all duration-1000"
                    alt="hero"
                />
            </div>
        </div>
    );
};

export default Background;
