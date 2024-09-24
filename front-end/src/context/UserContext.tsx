import React, { createContext, Dispatch, SetStateAction, useState } from "react"

export interface User {
    id: string;
    username: string;
    email: string;
    refreshToken: string;
    first_name: string | null;
    last_name: string | null;
}



type UserContextType = {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
    accessToken: string;
    setAccessToken: Dispatch<SetStateAction<string>>;
    refreshToken: string;
    setRefreshToken: Dispatch<SetStateAction<string>>;
};

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string>("");
    const [refreshToken, setRefreshToken] = useState<string>("");
    return (
        <UserContext.Provider value={{user, setUser, accessToken, setAccessToken, refreshToken, setRefreshToken}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;
