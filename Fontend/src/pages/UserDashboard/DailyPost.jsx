import React from 'react';

const promoImages = [
  { id: 1, src: 'https://via.placeholder.com/300x200?text=Promo+1', alt: 'Paily post' },
  { id: 2, src: 'https://via.placeholder.com/300x200?text=Promo+2', alt: 'Paily post' },
  { id: 3, src: 'https://via.placeholder.com/300x200?text=Promo+3', alt: 'Paily post' },
  { id: 4, src: 'https://via.placeholder.com/300x200?text=Promo+4', alt: 'Daily post 4' },
  { id: 5, src: 'https://via.placeholder.com/300x200?text=Promo+5', alt: 'aily post5' },
  { id: 6, src: 'https://via.placeholder.com/300x200?text=Promo+6', alt: 'Paily post' },
];

const DailyPost = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Our Promotions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {promoImages.map(({ id, src, alt }) => (
          <div key={id} className="overflow-hidden rounded-lg shadow-lg">
            <img 
              src={src} 
              alt={alt} 
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300" 
            />
          </div>
        ))}
      </div>
    </div>
  );
};



export default DailyPost;
