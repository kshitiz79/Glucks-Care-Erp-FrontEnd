import React from 'react';
import { Link } from 'react-router-dom';
import productData from '../../data/data.json';

const ProductList = () => {
  return (
    <div className="p-8  min-h-screen">
      <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-8 drop-shadow-lg">
        Our Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {productData.map((product) => (
          <Link
            to={`/product/${product.id}`}
            key={product.id}
            className="group block bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:scale-105"
            style={{ perspective: '1000px' }}
          >
            <div className="relative overflow-hidden rounded-t-xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full mx-auto h-48 object-cover transform group-hover:scale-100 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                <strong className="text-blue-700">Salt:</strong> {product.salt}
              </p>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2 group-hover:text-gray-800">
                {product.description}
              </p>
              <p className="text-gray-600 text-sm">
                <strong className="text-blue-700">Dosage:</strong> {product.dosage}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductList;