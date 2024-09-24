export interface Message {
    type: String,
    content: Record<string, string>
}

export const Init_Message = "init_message";
export const Chat_Message = "chat_message";
export const Disconnect_Message = "disconnect_message";
