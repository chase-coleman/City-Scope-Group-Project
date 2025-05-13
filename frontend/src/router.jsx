import { createBrowserRouter, useOutletContext } from "react-router-dom";
import App from "./App";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import TripViewPage from "./pages/TripViewPage";
import { ExplorePage } from "./pages/ExplorePage";
import  { TripsPage } from "./pages/TripsPage";

import { confirmUser } from './utilities/LoginPageUtils'




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
        element: <LoginPage />,
        loader: confirmUser,
      },
      {
        path: '/tripview/:trip_id',
        element: <TripViewPage />,
        loader: confirmUser,
      },
      {
        path: "/explore/:trip_id",
        element: <ExplorePage />,
        loader: confirmUser,
      },
      {
        path: '/trips',
        element: <TripsPage />,
        loader: confirmUser,
      }
    ],
  },
]);

export default router;