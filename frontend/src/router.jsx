import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage"
import TripViewPage from "./pages/TripViewPage";

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
        path: "/tripview",
        element: <TripViewPage />
      },
      {
        path: '/Login',
        element: <LoginPage />,
      },
    ],
  },
]);

export default router;