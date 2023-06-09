import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/root';
import App from './App';
import ErrorPage from './routes/error-page';
import LoginPage from './compoents/Auth/loginForm';
import RegisterPage from './compoents/Auth/RegisterForm';
import { AuthProvider } from './compoents/AuthContext';


import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/app",
        element: <App /> //TODO change to feed 
      },
      {
        path: "/login",
        element: <LoginPage />
      },
      {
        path: "/register",
        element: <RegisterPage />
      },
      {
        path: "*", // Catch-all route
        element: <ErrorPage />
      }
    ]
  }
]);

// Render
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
