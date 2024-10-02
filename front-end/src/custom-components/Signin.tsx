import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import {  useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
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
import {Link,  useNavigate} from "react-router-dom";
import { loginUserType } from "@/zod/loginType";
import {UserContext } from "@/context/UserContext";

export function SignIn() {
    const userContext = useContext(UserContext);
    if(!userContext) {
        return null;
    }
    const {setUser, setAccessToken, setRefreshToken} = userContext;
    const navigate = useNavigate();

    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    // zod implementation
    const form = useForm<z.infer<typeof loginUserType>>({
        resolver: zodResolver(loginUserType),
        defaultValues: {
            username: "",
            password: ""
        },
    });


    // function to send submit request and redirect based on that
    async function onSubmit(values: z.infer<typeof loginUserType>) {
        setIsSubmitting(true);
        try {
            const response = await axios.post("https://import.meta.env.VITE_BACKEND:8000/api/v1/user/login-user", values, {
                withCredentials: true
            });
            if (response.data.statusCode == 200) {
                toast({
                    title: "Success",
                    description:
                        "Successfully logged in",
                });
                const currentUser = await axios.get("https://import.meta.env.VITE_BACKEND:8000/api/v1/user/current-user-cookie", {withCredentials: true});
                if(currentUser.data.statusCode == 200 && currentUser.data.data) {
                    setUser(currentUser.data.data);
                    setAccessToken(response.data.data?.accessToken || "");
                    setRefreshToken(response.data.data?.refreshToken || "");
                    navigate("/chat");
                }
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Could not sign you in right now",
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
                        Sign in to start chatting
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
                                        <Input placeholder="username / email" {...field} />
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
                       <Button type="submit" disabled={isSubmitting}>
                            Submit
                        </Button>
                    </form>
                </Form>
                <div className="text-center mr-4">
                    <p>
                        Not a member?{" "}
                        <Link
                            to={"/sign-up"}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

