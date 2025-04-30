import { createBrowserRouter, useOutletContext } from "react-router-dom";
import App from "./App";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import TripViewPage from "./pages/TripViewPage";
import ExplorePage from "./pages/ExplorePage";
import TripsPage from "./pages/TripsPage";

import { confirmUser } from './Utilities/LoginPageUtils'




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
      },
      {
        path: '/tripview',
        element: <TripViewPage />
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