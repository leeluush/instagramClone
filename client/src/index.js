import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./routes/error-page";
import LoginPage from "./components/Auth/loginForm";
import RegisterPage from "./components/Auth/RegisterForm";
import { AuthProvider } from "./components/Auth/AuthContext";
import { Navigate } from "react-router-dom";

import "./index.css";
import Feed from "./components/Feed";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "/",
        element: <Root />,
        children: [
          {
            path: "feed",
            element: <Feed />,
          },
          {
            path: "*", // Catch-all route for / routes
            element: <Navigate to="/feed" />,
          },
        ],
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "*", // Catch-all route for all routes
        element: <ErrorPage />,
      },
    ],
  },
]);

// Render
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
