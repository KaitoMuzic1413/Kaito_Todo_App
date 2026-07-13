import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-slate-50 p-4">
      <img 
        src="/404_NotFound.png" 
        alt="404 Not Found" 
        className="max-w-full mb-6 w-96 object-contain rounded-xl shadow-inner" 
      />
      
      <p className="text-2xl font-bold text-slate-800">Oops!</p>
      <p className="text-xl font-semibold text-slate-600 mt-1">The page you're looking for doesn't exist.</p>
      <Link 
        to="/" 
        className="inline-block px-8 py-3.5 mt-8 font-medium text-white transition shadow-md bg-blue-600 rounded-2xl hover:bg-blue-700 active:scale-95"
      >
        Back To HomePage
      </Link>
    </div>
  );
};

export default NotFound;