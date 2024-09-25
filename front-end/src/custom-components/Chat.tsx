import { UserContext } from "@/context/UserContext"
import { useSocket } from "@/hooks/useSocket";
import { useContext, useEffect} from "react"
import { useNavigate } from "react-router-dom";
import ChatPage from "./v0Components/ChatPage";
import { Loader2Icon } from "lucide-react";
import { Init_Message, Message } from "@/wsMessages/MessageTypes";

const Chat = () => {
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
                const initMessage: Message = {
                    type: Init_Message,
                    content: {
                        accessToken,
                        username: user.username
                    }
            };
            console.log({initMessage})
            socket.send(JSON.stringify(initMessage));
        }
    }, [userContext, user, navigate, socket]);

    if(!socket || !user) {
        return <Loader2Icon />;
    }
    return (
        <div>
            <ChatPage />
        </div>
    )
}

export default Chat
