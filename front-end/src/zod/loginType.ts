import { z } from "zod";

const loginUserType = z.object({
    username: z.string({message: "The username or email should be provided"}),
    password: z.string({message: "The password should be provided"}).min(6, "The minimum password length should be 6").max(20, "The maximum password length sould be 20"),
});

export { loginUserType }
