import {z} from "zod";

const validateTokenType = z.object({
    accessToken: z.string({message: "Access token not provided"})
});

export {
    validateTokenType
}
