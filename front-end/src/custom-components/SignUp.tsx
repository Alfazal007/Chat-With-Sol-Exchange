import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { signUpSchema } from "@/zod/createUserType";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function SignUp() {
    const [username, setUsername] = useState<string>("");
    const [isCheckingUsername, setIsCheckingUsername] =
        useState<boolean>(false);
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [usernameMessage, setUsernameMessage] = useState<string>("");
    const debounced = useDebounceCallback(setUsername, 700);
    // zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            lastName: "",
            firstName: ""
        },
    });

    // use effect to check username uniqueness
    useEffect(() => {
        async function getInfo() {
            if (!username) {
                return;
            }
            setIsCheckingUsername(true);
            try {
                const response = await axios.get(
                    `/api/user/check-unique-username?username=${username}`
                );
                let message = response.data.message;
                setUsernameMessage(message);
            } catch (err) {
                console.log(err);
                setUsernameMessage("Issue talking to the server");
            }
            setIsCheckingUsername(false);
        }
        getInfo();
    }, [username]);

    // function to send submit request and redirect based on that
    async function onSubmit(values: z.infer<typeof signUpSchema>) {
        setIsSubmitting(true);
        try {
            const response = await axios.post("/api/user/sign-up", values);
            if (response.data.statusCode == 200) {
                toast({
                    title: "Success",
                    description:
                        "Successfully signed up now verify your account",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Unexpected input from client",
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            toast({
                variant: "destructive",
                title: "Error",
                description:
                    (axiosError?.response?.data as { data?: string })?.data ||
                    "Unexpected data",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Sol Chatter
                    </h1>
                    <p className="mb-4">
                        Sign up to start chatting
                    </p>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="username"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                debounced(e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                    {isCheckingUsername && (
                                        <Loader2 className="animate-spin" />
                                    )}
                                    {username && (
                                        <p
                                            className={`text-sm ${usernameMessage ===
                                                    "Username is available"
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                                } `}
                                        >
                                            {usernameMessage}
                                        </p>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="password"
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="firstname"
                                            type="text"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="lastname"
                                            type="text"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            Submit
                        </Button>
                    </form>
                </Form>
                <div className="text-center mr-4">
                    <p>
                        {
                            /*
                        Already a member?{" "}
                        <Link
                            href={"/sign-in"}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Sign in
                        </Link>
                        */
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}
