import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      role="status"
      aria-label="Завантаження додатку"
    >
      <div className="text-center glass-card p-8 rounded-2xl">
        <div 
          className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-600 mx-auto mb-4"
          aria-hidden="true"
        ></div>
        <p className="text-xl font-medium text-gray-800 animate-pulse">Завантаження...</p>
        <p className="text-sm text-gray-600 mt-2">Готуємо вашу подорож</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;