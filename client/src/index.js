import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./routes/error-page";
import LoginPage from "./components/Auth/loginForm";
import RegisterPage from "./components/Auth/RegisterForm";
import Feed from "./components/Feed/Feed";
import SuggestedUsersPage from "./components/SuggestedUsers/SuggestedUsersPage";
import MainLayout from "./components/Layouts/MainLayout";
import { AuthProvider } from "./components/Auth/AuthContext";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "feed",
        element: (
          <MainLayout>
            <Feed />
          </MainLayout>
        ),
      },
      {
        path: "suggested-for-you",
        element: (
          <MainLayout>
            <SuggestedUsersPage />
          </MainLayout>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/feed" />,
      },
    ],
  },
  {
    path: "login",
    element: (
      <MainLayout showHeader={false}>
        <LoginPage />
      </MainLayout>
    ),
  },
  {
    path: "register",
    element: (
      <MainLayout showHeader={false}>
        <RegisterPage />
      </MainLayout>
    ),
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
