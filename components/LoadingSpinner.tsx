import React from 'react';

const LoadingSpinner: React.FC<{ message?: string }> = ({ message = "Yükleniyor..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-light text-brand-primary">
      <div className="w-16 h-16 border-4 border-brand-secondary border-t-transparent border-solid rounded-full animate-spin"></div>
      <p className="mt-4 text-xl font-serif">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
