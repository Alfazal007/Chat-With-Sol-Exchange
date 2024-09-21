import {z} from "zod";

const signUpSchema = z.object({
    username: z.string({message: "The username should be provided"}).min(6, "The minimum username length should be 6").max(20, "The maximum username length sould be 20"),
    password: z.string({message: "The password should be provided"}).min(6, "The minimum password length should be 6").max(20, "The maximum password length sould be 20"),
    email: z.string({message: "Email not provided"}).email({message: "The email is invalid"}),
    firstName: z.string().min(6, "Minimum characters are 6 in first name").max(20, "Maximum 20 characters in first name").optional(),
    lastName: z.string().min(6, "Minimum characters are 6 in last name").max(20, "Maximum 20 characters in last name").optional(),
});

export {signUpSchema}
