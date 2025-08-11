import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BASE_URL from '../../BaseUrl/baseUrl';
import {
  FiPackage,
  FiImage,
  FiFileText,

  FiCheck,
  FiAlertCircle,
  FiUpload,
  FiX,
  FiSave,
  FiRefreshCw,
  FiPieChart,
  FiPrinter
} from 'react-icons/fi';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    salt: '',
    description: '',
    dosage: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors when user starts typing
    if (error) setError('');
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Remove image
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Create a FormData object to hold text fields and file
    const data = new FormData();
    data.append('name', formData.name.trim());
    data.append('salt', formData.salt.trim());
    data.append('description', formData.description.trim());
    data.append('dosage', formData.dosage.trim());
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
      setSuccess(`Product "${newProduct.name}" added successfully!`);

      // Clear form fields
      setFormData({
        name: '',
        salt: '',
        description: '',
        dosage: '',
      });
      setImage(null);
      setImagePreview(null);

      // Reset file input
      const fileInput = document.getElementById('image-upload');
      if (fileInput) fileInput.value = '';

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);

    } catch (error) {
      console.error(error);
      setError(error.message || 'Server error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
            <FiPackage className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Add New Product</h1>
          <p className="text-gray-600">Create a new pharmaceutical product entry</p>
        </div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center"
          >
            <FiCheck className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-green-800 font-medium">{success}</span>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center"
          >
            <FiAlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <span className="text-red-800 font-medium">{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <FiPackage className="inline mr-2" />
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name (e.g., Paracetamol)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                  required
                />
              </div>

              {/* Salt Composition */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <FiPieChart className="inline mr-2" />
                  Salt Composition *
                </label>
                <input
                  type="text"
                  name="salt"
                  value={formData.salt}
                  onChange={handleChange}
                  placeholder="Enter salt composition (e.g., Acetaminophen)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <FiFileText className="inline mr-2" />
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter detailed product description, uses, and benefits..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  required
                />
              </div>

              {/* Dosage */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <FiPrinter className="inline mr-2" />
                  Dosage Information *
                </label>
                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  placeholder="Enter dosage (e.g., 500mg, 2 tablets daily)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <FiImage className="inline mr-2" />
                  Product Image (Optional)
                </label>

                {!imagePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                    <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Click to upload product image</p>
                    <input
                      id="image-upload"
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <label
                      htmlFor="image-upload"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center"
                    >
                      <FiUpload className="mr-2" />
                      Choose Image
                    </label>
                    <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="border border-gray-300 rounded-xl p-4">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <FiRefreshCw className="animate-spin mr-2" />
                      Adding Product...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <FiSave className="mr-2" />
                      Add Product
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Form Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-600">
              <FiAlertCircle className="w-4 h-4 mr-2" />
              <span>All fields marked with * are required. Product images help with identification.</span>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <FiFileText className="mr-2" />
            Product Entry Guidelines
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">Product Name</h4>
              <p>Use the brand name or generic name of the medicine</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Salt Composition</h4>
              <p>Include the active pharmaceutical ingredient(s)</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p>Provide therapeutic uses, indications, and key benefits</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Dosage</h4>
              <p>Specify strength, frequency, and administration route</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
