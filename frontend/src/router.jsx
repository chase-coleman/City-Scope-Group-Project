import { createBrowserRouter, useOutletContext } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import React from 'react';
import Login from './pages/Login'
import {confirmUser} from './Utilities/LoginPageUtils'


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
    ],
  },
]);

export default router;