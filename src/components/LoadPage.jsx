import React from 'react';

const LoadPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700">
      <div className="flex items-center justify-center">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-blue-200 h-24 w-24"></div>
      </div>
    </div>
  );
};

export default LoadPage;
