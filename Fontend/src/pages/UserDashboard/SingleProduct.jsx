import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BASE_URL from '../../BaseUrl/baseUrl';

const SingleProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error(err));
  }, [productId]);

  return (
    <div className="p-6">
      <div className="mx-auto bg-white shadow-md rounded-lg p-6 max-w-xl">
        <img
          src={product.image} // Use the full Cloudinary URL directly
          alt={product.name}
          className="w-full h-96 object-cover rounded mb-4"
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
