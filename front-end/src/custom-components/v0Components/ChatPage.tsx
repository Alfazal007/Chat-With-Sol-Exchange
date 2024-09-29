import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from 'axios'
import ChatSearchResult from './ChatSearched'
import { ChatMapType, Chats, Message } from './ChattingPage'
import SolPayerComponent from './SolPayerComponent'

export default function ChatSearcher({chats, setSelectedMessages, setSelectedChat}: {chats: ChatMapType<string, Chats>, setChats: (key: string, value: Chats) => void, setSelectedChat: React.Dispatch<React.SetStateAction<string | null>>,
    setSelectedMessages: React.Dispatch<React.SetStateAction<Message[]>> }) {
    const [username, setUsername] = useState('');
    const [found, setFound] = useState(false);
    const [visible, setIsVisible] = useState(false);
    const [foundUsername, setFoundUsername] = useState("");
    const [isVisibleSol, setIsVisibleSol] = useState<boolean>(false);
    const openSearchedChat = () => {
        if(!found || !foundUsername || !visible) {
            setSelectedChat(null);
            setIsVisible(false);
            setFound(false);
            return;
        }
        setSelectedChat(foundUsername);
        setSelectedMessages(chats.get(foundUsername)?.messages || []);
        setFound(false);
        setIsVisible(false);
        setSelectedChat(foundUsername);
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if(chats.has(username)) {
                setIsVisible(true);
                setFound(true);
                setFoundUsername(username);
                return;
            }
            const userPresent = await axios.get(`http://localhost:8000/api/v1/user/get-username/${username}`, {
                withCredentials: true
            });
            setFoundUsername(username);
            setIsVisible(true);
            if(userPresent.data.statusCode == 200) {
                setFound(true);
            } else if(userPresent.data.statusCode == 404) {
                setFound(false);
            }
        } catch(err) {
            setIsVisible(true);
            setFound(false);
        }
    }

    const visibleFalse = () => {
        setIsVisible(false);
        setUsername("");
        setFoundUsername("");
    }

    return (
        <div className="flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
        {JSON.stringify(setSelectedMessages)}
            <div
            className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm"
        >
            <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
                <Input
                type="text"
                placeholder="Enter the username you want to chat with"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out"
                required
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <div
            >
                        { visible &&
                            <ChatSearchResult
                                userData={{userData: {setIsVisibler: visibleFalse, username: foundUsername, found}}} openSearchedChat={openSearchedChat} />
                        }
                <Button
                type="submit" 
                className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                Search
                </Button>
                <Button
                onClick={()=>{setIsVisibleSol((prev) => !prev)}}
                className="w-full mt-2 hidden lg:block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                {isVisibleSol ? ("Hide") : ("Show")} Send Sol
                </Button>
            </div>
            </form>
                { isVisibleSol &&
                    <div>
                        <SolPayerComponent />
                    </div>
                }
        </div>
        </div>
      )
}
