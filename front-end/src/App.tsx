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
import UserProvider from './context/UserContext';
import ChatPage from './custom-components/v0Components/ChattingPage';

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
            path: "/new-chat",
            element: <Chat />,
        },
        {
            path: "/chat",
            element: <ChatPage />,
        },
    ]);

    return (
        <div>
            <UserProvider>
                <RouterProvider router={router} />
                <Toaster />
            </UserProvider>
        </div>
    )
}

export default App
