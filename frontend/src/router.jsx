import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import HomePage from "./pages/HomePage";
// import Login from './pages/Login'
import TripViewPage from "./pages/TripViewPage";
import React from 'react';
import Login from './pages/Login'

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
        path: '/tripview',
        element: <TripViewPage />
      }
    ],
  },
]);

export default router;