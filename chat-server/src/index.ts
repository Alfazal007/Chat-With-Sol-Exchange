import { WebSocketServer } from 'ws';
import {configDotenv} from "dotenv";
import { ChatManager } from './Managers/chatManager';
configDotenv({path: ".env"})

const port = process.env.PORT || 8001;

const wss = new WebSocketServer({ port: port as number }, ()=> {
    console.log(`Server running on port ${port}`);
});

const chatManager = ChatManager.getInstance();

wss.on('connection', function connection(ws) {
    ws.on('error', () => ws.close());
    chatManager.addHandlers(ws);
});
