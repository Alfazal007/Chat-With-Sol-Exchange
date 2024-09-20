import { createClient } from "redis";
import { pushMessageToDB } from "./utils/pushToDB";
import { configDotenv } from "dotenv";

configDotenv({path: ".env"})

export const client = createClient();

async function startWorker() {
    try {
        await client.connect();
        console.log("Worker connected to Redis.");
        // Main loop
        while (true) {
            try {
                const redisData = await client.brPop("chat_message", 0);
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
