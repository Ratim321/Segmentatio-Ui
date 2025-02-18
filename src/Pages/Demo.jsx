import React from 'react';
import ImageSegmentation from '../components/Demo/components/ImageSegmentation';

const Demo = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Image Segmentation Analysis</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <ImageSegmentation />
      </div>
    </div>
  );
};

export default Demo;