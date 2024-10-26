import dotenv from 'dotenv';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
dotenv.config(); 



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
 {/* Wrap your App with BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

if (typeof window !== 'undefined') {
  window.process = {
    env: {
      // Add any essential environment variables here if needed
      NODE_ENV: 'development', 
    },
  };
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
