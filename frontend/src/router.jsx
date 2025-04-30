import { createBrowserRouter, useOutletContext } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import React from 'react';
import Login from './pages/LoginPage'

import {confirmUser} from './Utilities/LoginPageUtils'


import ExplorePage from "./pages/ExplorePage";
import TripsPage from "./pages/TripsPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: confirmUser,
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
    },
    {
      path: '/trips',
      element: <TripsPage />
    }
    ],
  },
]);

export default router;