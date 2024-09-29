import { useContext, useEffect, useState } from 'react'
import { Send, Menu, Loader2Icon } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserContext } from '@/context/UserContext'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '@/hooks/useSocket'
import ChatSearcher from './ChatPage'
import { Chat_Message, Init_Message } from '@/wsMessages/MessageTypes'
import {nanoid} from 'nanoid'

export interface ChatPreview {
    id: string
    name: string
    lastMessage: string
}

export interface Chats {
    id: string
    messages: Message[]
}


export interface Message {
    id: string
    sender: string
    content: string
}

export type ChatMapType<K, V> = Map<K, V>;


export default function ChatPage() {
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [messageToBeSent, setMessageToBeSent] = useState<string>("");
    const [chats, setChats] = useState<ChatMapType<string, Chats>>(new Map());
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [selectedMessages, setSelectedMessages] = useState<Message[]>([]);

    const updateChat = (key: string, value: Chats) => {
        setChats(new Map(chats.set(key, value)));
    }

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
        if(socket && user) {
            const initMessage: { type: String, content: Record<string, string> } = {
                type: Init_Message,
                content: {
                    accessToken,
                    username: user.username
                }
        };
        socket.send(JSON.stringify(initMessage));
        // TODO:: fetch the unread messages first
    }}, [userContext, user, navigate, socket]);
    useEffect(()=>{
        if(!socket) {
            return;
        }
        socket.onmessage = (event) => {
            const messageReceived = JSON.parse(event.data);
            const {sender, content} = messageReceived;
            if(chats.has(sender)) {
                // logic of isPresent
                const valueToBeUpdated = chats.get(sender);
                if(!valueToBeUpdated) {
                    updateChat(sender, {messages: [{id: nanoid(), content, sender}], id: sender})
                } else {
                    const prevMessages = valueToBeUpdated.messages;
                    const newMessages = [...prevMessages, {sender, content, id: nanoid()}]
                    updateChat(sender, {id: sender, messages: newMessages});

                }
            } else {
                // logic of not present
                updateChat(sender, {id: sender, messages: [{content, sender, id: nanoid()}]});
            }
            if(sender == selectedChat) {
                setSelectedChat(sender);
                setSelectedMessages(chats.get(sender)?.messages || []);
            }
        }
    }, [socket, chats])

    if(!socket || !user) {
        return <Loader2Icon />;
    }

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if(!selectedChat) {
            return;
        }
        const messageBeingSent = {
            type: Chat_Message,
            content: {
                sender: user.username,
                receiver: selectedChat,
                content: messageToBeSent
            }
        }
        socket.send(JSON.stringify(messageBeingSent));
        /**/
        if(chats.has(selectedChat)) {
            // logic of isPresent
            const valueToBeUpdated = chats.get(selectedChat);
            if(!valueToBeUpdated) {
                updateChat(selectedChat, {messages: [{content: messageToBeSent, sender: user.username, id: nanoid()}], id: selectedChat});
            } else {
                updateChat(selectedChat, {id: selectedChat,
                messages: [...valueToBeUpdated.messages, {content: messageToBeSent, sender: user.username, id: nanoid()}]})
            }
        } else {
            // logic of not present
            updateChat(selectedChat, {id: selectedChat, messages: [{id: nanoid(), sender: user.username, content: messageToBeSent}]})
        }
        setSelectedChat(selectedChat);
        setSelectedMessages(chats.get(selectedChat)?.messages || []);
        setMessageToBeSent("");
    }
        return (
        <div className="flex h-screen bg-gray-100">
        <div
            className={`bg-white w-full md:w-1/3 lg:w-1/4 border-r ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}
        >
            <ScrollArea className="h-full">
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Chats</h2>
                <div className='top-0'>
                    <ChatSearcher chats={chats} setChats={updateChat} setSelectedMessages={setSelectedMessages} setSelectedChat={setSelectedChat} />
                </div>
                {Array.from(chats.entries()).map(([id, chat]) => (
                <div
                    key={nanoid()}
                    className={`p-3 rounded-lg mb-2 cursor-pointer ${
                    selectedChat === id ? 'bg-blue-100' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => {
                    setSelectedChat(id)
                    setIsMobileMenuOpen(false)
                    setSelectedMessages(chat.messages)
                    }}
                >
                    <div className="font-semibold">{chat.id}</div>
                    <div className="text-sm text-gray-500">{chat.messages[chat.messages.length - 1].content || ""}</div>
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
                {selectedChat || "Selected a chat"}
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
                {
                    selectedChat && 
                    <form onSubmit={handleSendMessage} className="bg-white p-4 border-t">
                    <div className="flex space-x-2">
                        <Input
                        type="text"
                        placeholder="Type a message..."
                        value={messageToBeSent}
                        onChange={(e) => setMessageToBeSent(e.target.value)}
                        className="flex-1"
                        />
                        <Button type="submit" className="bg-blue-600">
                        <Send className="h-4 w-4 mr-2" />
                        Send
                        </Button>
                    </div>
                    </form>
                }
        </div>
        </div>
    )
}
