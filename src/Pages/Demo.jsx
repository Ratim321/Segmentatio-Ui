import React from 'react';
import ImageSegmentation from '../components/Demo/components/ImageSegmentation';

const Demo = () => {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="h-full">
        <ImageSegmentation />
      </div>
    </div>
  );
};

export default Demo;