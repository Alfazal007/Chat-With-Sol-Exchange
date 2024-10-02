import { useEffect, useState } from "react";

const WS_URL = "ws://import.meta.env.VITE_BACKEND:8001";

export const useSocket = () => {
    const [_, setIsConnecting] = useState(false);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    useEffect(() => {
        setIsConnecting(true);
        const ws = new WebSocket(WS_URL);
        ws.onopen = () => {
            setSocket(ws);
            setIsConnecting(false);
        };
        ws.onclose = () => {
            setSocket(null);
            setIsConnecting(false);
        };
        return () => {
            //ws.close();
        };
    }, []);
    return socket;
};
