import { client } from "../index";
import { prisma } from "./prisma"

export const pushMessageToDB = async (sender: string, receiver: string, content: string) => {
    try {
        if(!content || !sender || !receiver) {
            return;
        }
        let senderUser;
        let receiverUser;
        try {
            senderUser = await prisma.user.findFirst({
                where: {
                    username: sender
                }
            });
            if(!senderUser) {
                return;
            }
        } catch(err) {
            await client.lPush("chat_message", JSON.stringify({ sender, receiver, content }));
            return;
        }
        try {
            receiverUser = await prisma.user.findFirst({
                where: {
                    username: receiver
                }
            });
            if(!receiverUser) {
                return;
            }
        } catch(err) {
            await client.lPush("chat_message", JSON.stringify({ sender, receiver, content }));
            return;
        }
        if(!senderUser || !receiverUser) {
            return;
        }
        // add to the database
        try {
            await prisma.message.create({
                data: {
                    sender: senderUser.id,
                    receiver: receiverUser.id,
                    content: content,
                }
            });
            return;
        } catch (error) {
            await client.lPush("chat_message", JSON.stringify({ sender, receiver, content }));
            return;
        }
    } catch(err) {
        await client.lPush("chat_message", JSON.stringify({ sender, receiver, content }));
        return;
    }
}
