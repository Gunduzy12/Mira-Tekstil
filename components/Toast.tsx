import React from 'react';

interface ToastProps {
  message?: string;
  type?: 'success' | 'error' | 'info';
  isVisible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', isVisible }) => {
  if (!isVisible || !message) {
    return null;
  }

  const baseClasses = 'fixed bottom-5 right-5 z-[100] p-4 rounded-lg shadow-lg text-white transition-all duration-300 ease-in-out transform';
  
  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  const visibilityClasses = isVisible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-10';

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${visibilityClasses}`}>
      {message}
    </div>
  );
};

export default Toast;