import WebSocket from "ws";
import { Chat_Message, Disconnect_Message, Init_Message, validationUrl } from "../constants";
import axios from "axios";
import {createClient, RedisClientType} from "redis";

export class ChatManager {
    private static chatManager: ChatManager;
    public connections: Map<string, WebSocket>;
    public client: RedisClientType;

    private constructor() {
        this.connections = new Map<string, WebSocket>();
        this.client = createClient();
        this.client.connect().then(()=>{}).catch(()=> {console.log("Failed to connect to redis client");})
    }

    static getInstance(): ChatManager {
        if(!ChatManager.chatManager) {
            ChatManager.chatManager = new ChatManager();
        }
        return ChatManager.chatManager;
    }

    public addHandlers(ws: WebSocket) {
        ws.on("error" , ()=> {
            for (const [username, client] of this.connections) {
                if(ws == client) {
                    client.close();
                    this.connections.delete(username);
                }
            }
        });
        ws.on("close" , ()=> {
            for (const [username, client] of this.connections) {
                if(ws == client) {
                    client.close();
                    this.connections.delete(username);
                }
            }
        });
        ws.on("message" , async (messageSent)=> {
            let message: Message;
            try {
                message = JSON.parse(messageSent.toString());
            } catch(err) {
                ws.send("Invalid data provided");
                return;
            }
            if(!message || !message.type || !message.content) {
                ws.send("Invalid data provided, data should have type and content");
                return;
            }
            if(message.type == Init_Message) {
                const {accessToken, username} = message.content;
                if(!accessToken || !username) {
                    return;
                }
                // delete any previous instances if present
                const prevSocket = this.connections.get(username);
                if(prevSocket) {
                    prevSocket.close();
                    this.connections.delete(username);
                }
                const isValidUser = await this.authenticateUser(username, accessToken);
                if(isValidUser) {
                    this.connections.set(username, ws);
                } else {
                    ws.close();
                    return;
                }
                console.log(this.connections);
            } else if(message.type == Chat_Message) {
                this.sendNormalMessage(message, ws);
            } else if(message.type == Disconnect_Message) {
                const {username} = message.content;
                if(!username) {
                    ws.close();
                    return;
                }
                this.disconnectFromChatServer(username, ws);
            }
        });
    }

    public async authenticateUser(username: string, accessToken: string): Promise<boolean> {
        const validatedUser = await axios.post(validationUrl, {
            accessToken
        });
        // @ts-ignore
        const statusCode: number = validatedUser.data?.statusCode;
        if(!statusCode || statusCode != 200) {
            return false;
        }
        // @ts-ignore
        const usernameFromDB = validatedUser.data?.data?.username;
        if(!usernameFromDB || usernameFromDB != username) {
            return false;
        }
        return true;
    }

    public async sendNormalMessage(message: Message, ws: WebSocket) {
        // call the authentication function
        const {sender, receiver, content} = message.content;
        if(!this.connections.has(sender)) {
            ws.close();
            return;
        }
        if(ws != this.connections.get(sender)) {
            ws.close();
            return;
        }
        if(!this.connections.has(receiver)) {
            try {
                await this.client.lPush("chat_message", JSON.stringify({ sender, receiver, content }));
                return;
            } catch(err) {
                console.log(err);
                ws.send("Server down send the message later or when the other side is online");
                return;
            }
        } else {
            const receiverConnection = this.connections.get(receiver);
            receiverConnection?.send(content);
        }
    }

    public disconnectFromChatServer(username: string, socket: WebSocket) {
        const instanceToDisconnect = this.connections.get(username);
        if(!instanceToDisconnect) {
            socket.close();
            return;
        }
        if(instanceToDisconnect == socket) {
            instanceToDisconnect.close();
            this.connections.delete(username);
        } else {
            socket.close();
        }
    }
}
