import React from 'react';
import { useParams } from 'react-router-dom';
import productData from './../../data/data.json';

const SingleProduct = () => {
  const { id } = useParams();
  const productId = parseInt(id, 10);
  const product = productData.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold">Product not found</h2>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className=" mx-auto bg-white shadow-md rounded-lg p-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-60 object-cover rounded mb-4"
        />
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-700 mb-2">
          <strong>Salt:</strong> {product.salt}
        </p>
        <p className="text-gray-700 mb-2">{product.description}</p>
        <p className="text-gray-700">
          <strong>Dosage:</strong> {product.dosage}
        </p>
      </div>
    </div>
  );
};

export default SingleProduct;
