import React, { useState } from 'react';
import BASE_URL from '../../BaseUrl/baseUrl';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    salt: '',
    description: '',
    dosage: '',
  });
  const [image, setImage] = useState(null);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Create a FormData object to hold text fields and file
    const data = new FormData();
    data.append('name', formData.name);
    data.append('salt', formData.salt);
    data.append('description', formData.description);
    data.append('dosage', formData.dosage);
    if (image) {
      data.append('image', image);
    }

    try {
      const res = await fetch(`${BASE_URL}/api/products`, {
        method: 'POST',
        body: data,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add product');
      }
      const newProduct = await res.json();
      alert('Product added successfully!');
      // Clear form fields
      setFormData({
        name: '',
        salt: '',
        description: '',
        dosage: '',
      });
      setImage(null);
    } catch (error) {
      console.error(error);
      alert(error.message || 'Server error');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          name="salt"
          value={formData.salt}
          onChange={handleChange}
          placeholder="Salt"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          name="dosage"
          value={formData.dosage}
          onChange={handleChange}
          placeholder="Dosage"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="file"
          name="image"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded"
          accept="image/*"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
