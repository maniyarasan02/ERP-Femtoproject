import React from 'react';

const LoadingSpinner = ({ fullScreen = false }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin transition-all duration-300" />
      <span className="mt-4 text-sm font-medium text-indigo-600 animate-pulse">Loading logistics...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
