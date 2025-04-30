import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import React from 'react';
import Login from './pages/Login'
import ExplorePage from "./pages/ExplorePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '/login',
        element: <Login />,
    },
    {
      path: '/explore',
      element: <ExplorePage />
    }
    ],
  },
]);

export default router;