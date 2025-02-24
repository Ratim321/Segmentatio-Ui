import React from 'react';
import ImageSegmentation from '../components/Demo/components/ImageSegmentation';

const Demo = () => {
  return (
    <div>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="relative">  {/* Added wrapper for sticky positioning */}
            <ImageSegmentation />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;