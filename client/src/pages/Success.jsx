import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGlobalContext } from '../provider/GlobalProvider';

const Success = () => {
  const location = useLocation();
  const { fetchCartItem, fetchOrder } = useGlobalContext();

  useEffect(() => {
    let attempts = 0;

    const checkWebhookSync = async () => {
      attempts++;
      await fetchCartItem();
      await fetchOrder();

      // Optional: clear cart from localStorage
      localStorage.removeItem("cart");

      if (attempts < 5) {
        setTimeout(checkWebhookSync, 1500);
      }
    };

    checkWebhookSync();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] animate-fade">
      
      <div className="bg-green-200 p-6 rounded-lg shadow-xl w-[90%] max-w-sm 
                      text-center animate-pop">
        
        <p className="text-green-800 font-bold text-xl mb-4">
          {location?.state?.text ? location.state.text : "Payment"} Successful
        </p>

        <Link
          to="/"
          className="border border-green-900 text-green-900 px-4 py-2 rounded 
                     hover:bg-green-900 hover:text-white transition-all 
                     active:scale-95"
        >
          Go To Home
        </Link>
      </div>

    </div>
  );
};

export default Success;
