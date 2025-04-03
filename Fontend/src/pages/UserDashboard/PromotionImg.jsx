import React from 'react';

const promoImages = [
  { id: 1, src: 'https://via.placeholder.com/300x200?text=Promo+1', alt: 'Promotion 1', title: 'Special Offer 1' },
  { id: 2, src: 'https://via.placeholder.com/300x200?text=Promo+2', alt: 'Promotion 2', title: 'Special Offer 2' },
  { id: 3, src: 'https://via.placeholder.com/300x200?text=Promo+3', alt: 'Promotion 3', title: 'Special Offer 3' },
  { id: 4, src: 'https://via.placeholder.com/300x200?text=Promo+4', alt: 'Promotion 4', title: 'Special Offer 4' },
  { id: 5, src: 'https://via.placeholder.com/300x200?text=Promo+5', alt: 'Promotion 5', title: 'Special Offer 5' },
  { id: 6, src: 'https://via.placeholder.com/300x200?text=Promo+6', alt: 'Promotion 6', title: 'Special Offer 6' },
];

const PromotionImg = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Our Promotions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {promoImages.map(({ id, src, alt, title }) => (
          <div key={id} className="relative overflow-hidden rounded-lg shadow-lg">
            <img 
              src={src} 
              alt={alt} 
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300" 
            />
            <div className="absolute bottom-0 w-full bg-black bg-opacity-60 text-white text-center py-2">
              {title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromotionImg;
