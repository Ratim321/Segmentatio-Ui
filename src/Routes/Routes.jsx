import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/main";
import Hero from "../components/Hero";
import Research from "../components/Research";
import Testimonials from "../components/Testimonials";
import Demo from "../Pages/Demo";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: (
          <>
            <Hero />
            <Research />
            <Testimonials />
          </>
        ),
      },
      {
        path: "/demo",
        element: <Demo />,
      },
    ],
  },
]);