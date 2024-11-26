import React, { useState, useEffect } from 'react';


const Sam = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState([]);

  // Fetch all images from the backend
  const fetchImages = async () => {
    try {
      const response = await fetch('http://localhost:5000/images');
      const data = await response.json();

      if (response.ok) {
        setImages(data.images); // Set fetched images in state.
      } else {
        alert(data.message || 'Error fetching images');
      }
    } catch (error) {
      alert('Error fetching images: ' + error.message);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Set selected file.
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!image) {
      alert('Please select an image first.');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', image); // Add image file to FormData.
  
    try {
      // Send image to backend at correct URL.
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
  console.log("imageUrl-------------------",response)
      const data = await response.json();
  
      if (response.ok) {
        setImageUrl(data.url); // Set Cloudinary URL
        fetchImages();         // Fetch updated list of images.
      } else {
        alert(data.message || 'Error uploading image');
      }
    } catch (error) {
      alert('Error uploading image: ' + error.message);
    }
  };

  return (
    <div className="bg-gray-50 p-4 md:p-6">
      <h1 className="text-4xl font-bold text-center text-pink-500">Image Upload 😃</h1>


    {/* Image Upload Form */}
      <form onSubmit={handleSubmit}>
        <label>Image ☘️</label>
        <div className="mt-4">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Uploaded"
              className="object-cover w-full h-full"
              loading="lazy"
            />
          )}
          <input
            type="file"
            accept="image/*"
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-gray-400"
            onChange={handleFileUpload}
          />
        </div>
        <button type="submit" className="p-2 mt-4 bg-blue-500 text-white rounded">
          Upload Image
        </button>
      </form>



       {/* Display All Images */}
       <h2 className="text-2xl font-bold text-center mb-6">All Images 🖼️</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img) => (
          <div key={img._id} className="p-2 border border-gray-300 rounded">
            <img
              src={img.imageUrl}
              alt="Uploaded"
              className="object-cover w-full h-48 rounded"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sam;
