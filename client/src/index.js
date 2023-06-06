// JS Imports
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import Root, { loader as rootLoader } from './routes/root';
import App from './App';
import ErrorPage from './routes/error-page';
import LoginPage from './compoents/Auth/loginForm'
import RegisterPage from './compoents/Auth/RegisterForm';
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from './compoents/AuthContext'




import './index.css';

const router = createBrowserRouter([

  {

    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/app",
        element: <App />
      },
      {
        path: "/login",
        element: <LoginPage />
      },
      {
      index: true,
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />

    }
   ]
  }
])

// Render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

      <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>


  </React.StrictMode>
);
