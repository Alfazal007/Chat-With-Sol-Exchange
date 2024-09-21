import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
  Link,
} from "react-router-dom";
import { SignUp } from './custom-components/SignUp';
import { Toaster } from './components/ui/toaster';

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: (
            <div>
                <Link to="/about">About Us</Link>
            </div>
            ),
        },
        {
            path: "/sign-up",
            element: <SignUp />,
        }
    ]);

    return (
        <div>
            <RouterProvider router={router} />
            <Toaster />
        </div>
    )
}

export default App
