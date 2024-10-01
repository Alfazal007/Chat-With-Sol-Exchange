import { createClient } from "redis";
import { pushMessageToDB } from "./utils/pushToDB";
import { configDotenv } from "dotenv";

configDotenv({path: ".env"})
export const client = createClient({password: process.env.REDIS_PASSWORD, socket: {
    host: process.env.REDIS_HOST,
    port: Number.parseInt(process.env.REDIS_PORT || "11339")
}});

async function startWorker() {
    try {
        await client.connect();
        console.log("Worker connected to Redis.");
        // Main loop
        while (true) {
            try {
                const redisData = await client.brPop("chat_message", 0);
                if(!redisData) {
                    continue;
                }
                const {key, element} = redisData;
                if(key == "chat_message") {
                    const messageInfo = JSON.parse(element);
                    const {sender, receiver, content} = messageInfo;
                    if(!sender || !receiver || !content) {
                        continue;
                    } else {
                        await pushMessageToDB(sender, receiver, content);
                    }
                }
            } catch (error) {
                console.error("Error handling offline message", error);
            }
        }
    } catch (error) {
        console.error("Failed to connect to Redis", error);
    }
}

startWorker();
