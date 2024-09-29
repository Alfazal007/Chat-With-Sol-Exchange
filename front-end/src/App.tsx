import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
  Link,
} from "react-router-dom";
import { SignUp } from './custom-components/SignUp';
import { Toaster } from './components/ui/toaster';
import {SignIn} from './custom-components/Signin';
import UserProvider from './context/UserContext';
import ChatPage from './custom-components/v0Components/ChattingPage';
import SolPayer from './custom-components/SolPayer';



import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

import '@solana/wallet-adapter-react-ui/styles.css';


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
            path: "/pay-sol",
            element: <SolPayer />,
        },
        {
            path: "/chat",
            element: <ChatPage />,
        },
    ]);
    const endpoint = clusterApiUrl("devnet");

    return (
        <div>
            <UserProvider>
                <ConnectionProvider endpoint={endpoint}>
                    <WalletProvider wallets={[]} autoConnect>
                        <WalletModalProvider>
                            <RouterProvider router={router} />
                            <Toaster />
                        </WalletModalProvider>
                    </WalletProvider>
                </ConnectionProvider>
            </UserProvider>
        </div>
    )
}

export default App
