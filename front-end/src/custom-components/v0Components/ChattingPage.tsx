import { useContext, useEffect, useState } from 'react'
import { Send, Menu, Loader2Icon } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserContext } from '@/context/UserContext'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '@/hooks/useSocket'

interface ChatPreview {
    id: string
    name: string
    lastMessage: string
}

interface Chats {
    id: string
    messages: Message[]
}


interface Message {
    id: string
    sender: string
    content: string
}

export default function ChatPage() {
    const userContext = useContext(UserContext);
    const navigate = useNavigate();
    if (!userContext) {
        navigate("/sign-in");
        return null;
    }
    const {user, accessToken} = userContext || {};
    const socket = useSocket();
    useEffect(()=>{
        if(!user || !userContext || !accessToken) {
            navigate("/sign-in");
            return;
        }
        // TODO:: fetch the unread messages first
    }, [userContext, user, navigate, socket]);

    if(!socket || !user) {
        return <Loader2Icon />;
    }

    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [messageToBeSent, setMessageToBeSent] = useState<string>("");
//    const [newMessage, setNewMessage] = useState<Message | null>(null);
    const [chats, setChats] = useState<Chats[]>([]);
    const [chatPreviews, setChatPreviews] = useState<ChatPreview[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [selectedMessages, setSelectedMessages] = useState<Message[]>([]);


    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically send the message to your backend
        // const {sender, receiver, content} = message.content;
        //socket.send()
    }

    socket.onmessage = (event) => {
        const messageReceived = JSON.parse(event.data);
        const {sender, content} = messageReceived;
        let isPresent = false;
        for(let i = 0; i < chats.length; i++) {
            let chat = chats[i];
            if(chat.id == sender) {
                // found the chat just update the method
                isPresent = true;
                break;
            }
        }
        if(isPresent) {
            setChats((chats) => {
                return chats.map((chat) => chat.id != sender ? chat : {
                    id: sender,
                    messages: [...chat.messages, {
                        id: sender,
                        sender,
                        content
                    }]
                })
            });
            setChatPreviews((chats) => {
                return chats.map((chatPrev) => chatPrev.id != sender ? chatPrev: {
                    id: sender,
                    name: sender,
                    lastMessage: content
                })
            });
        } else {
            setChats((chats) => [...chats, {id: sender, messages: [
                {
                    id: sender,
                    sender,
                    content
                }
            ]}]);
            setChatPreviews((chats) => [...chats, {id: sender, name: sender, lastMessage: content}])
        }
    }

    return (
        <div className="flex h-screen bg-gray-100">
        {/* Chat List */}
        <div 
            className={`bg-white w-full md:w-1/3 lg:w-1/4 border-r ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}
        >
            <ScrollArea className="h-full">
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Chats</h2>
                {chatPreviews.map((chat) => (
                <div
                    key={chat.id}
                    className={`p-3 rounded-lg mb-2 cursor-pointer ${
                    selectedChat === chat.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => {
                    setSelectedChat(chat.id)
                    setIsMobileMenuOpen(false)
                    chats.map((chat)=>{
                        if(chat.id == selectedChat) {
                            setSelectedMessages(chat.messages)
                        }
                    });
                    }}
                >
                    <div className="font-semibold">{chat.name}</div>
                    <div className="text-sm text-gray-500">{chat.lastMessage}</div>
                </div>
                ))}
            </div>
            </ScrollArea>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="bg-white p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">
                {selectedChat ? chatPreviews.find(chat => chat.id === selectedChat)?.name : 'Select a chat'}
            </h2>
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
            </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
            { selectedMessages.map((message) => (
                <div
                key={message.id}
                className={`mb-4 ${message.sender === `${user.username}` ? 'text-right' : 'text-left'}`}
                >
                <div
                    className={`inline-block p-2 rounded-lg ${
                    message.sender === `${user.username}` ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                >
                    {message.content}
                </div>
                </div>
            ))}
            </ScrollArea>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="bg-white p-4 border-t">
            <div className="flex space-x-2">
                <Input
                type="text"
                placeholder="Type a message..."
                value={messageToBeSent}
                onChange={(e) => setMessageToBeSent(e.target.value)}
                className="flex-1"
                />
                <Button type="submit">
                <Send className="h-4 w-4 mr-2" />
                Send
                </Button>
            </div>
            </form>
        </div>
        </div>
    )
}
