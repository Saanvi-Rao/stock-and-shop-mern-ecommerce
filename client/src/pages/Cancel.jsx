import React from 'react';
import { Link } from 'react-router-dom';

const Cancel = () => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] animate-fade">
      
      <div className="bg-red-200 p-6 rounded-lg shadow-xl w-[90%] max-w-sm 
                      text-center animate-pop">
        
        <p className="text-red-800 font-bold text-xl mb-4">
          Order Cancelled
        </p>

        <Link
          to="/"
          className="border border-red-900 text-red-900 px-4 py-2 rounded 
                     hover:bg-red-900 hover:text-white transition-all 
                     active:scale-95"
        >
          Go To Home
        </Link>
      </div>

    </div>
  );
};

export default Cancel;
