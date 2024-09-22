import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
  Link,
} from "react-router-dom";
import { SignUp } from './custom-components/SignUp';
import { Toaster } from './components/ui/toaster';
import {SignIn} from './custom-components/Signin';
import Chat from './custom-components/Chat';

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
        },
        {
            path: "/sign-in",
            element: <SignIn />,
        },
        {
            path: "/chat",
            element: <Chat />,
        },
    ]);

    return (
        <div>
            <RouterProvider router={router} />
            <Toaster />
        </div>
    )
}

export default App
