import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root element
root.render(                                      // Render the app inside the root element
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
