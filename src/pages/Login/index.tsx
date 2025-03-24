import React from 'react';
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
// import { useDispatch } from "react-redux"
import {
    Form,
    FormLabel,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { AuthContext } from "@/context/AuthContext";

export function Login() {
    const { register, login } = React.useContext(AuthContext)!;
    const navigate = useNavigate();
    // const dispatch = useDispatch();

    const formLoginSchema = z.object({
        email: z.string().min(1, {
            message: "Whoops, can’t be empty…",
        }),
        password: z.string().min(1, {
            message: "Whoops, can’t be empty…",
        }),
    })

    const formLogin = useForm<z.infer<typeof formLoginSchema>>({
        resolver: zodResolver(formLoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    function onSubmitLogin(values: z.infer<typeof formLoginSchema>) {
        login(values);
        navigate("/contatos"); 
        // dispatch(fetchWordDefinition(values));
    }

    const formRegisterSchema = z.object({
        email: z.string().min(1, {
            message: "Whoops, can’t be empty…",
        }),
        password: z.string().min(1, {
            message: "Whoops, can’t be empty…",
        }),
        confirmPassword: z.string().min(1, {
            message: "Whoops, can’t be empty…",
        }),
    })

    const formRegister = useForm<z.infer<typeof formRegisterSchema>>({
        resolver: zodResolver(formRegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    function onSubmitRegister(values: z.infer<typeof formRegisterSchema>) {
        console.log(values)
        register(values);
        // dispatch(fetchWordDefinition(values));
    }


    return (
        <div className="mx-auto h-screen flex flex-col justify-center items-center">
            <Tabs defaultValue="login" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Cadastro</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                    <Card>
                        <CardContent className="flex flex-col space-y-2 gap-2">

                            <Form {...formLogin}>
                                <form onSubmit={formLogin.handleSubmit(onSubmitLogin)} className="space-y-8">
                                    <FormField
                                        control={formLogin.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input id="email" placeholder="teste@gmail.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={formLogin.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Senha</FormLabel>
                                                <FormControl>
                                                    <div className="space-y-1">
                                                        <Input id="password" type="password" placeholder="******" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <CardFooter className="w-auto flex justify-end">
                                        <Button type="submit" >Entrar</Button>
                                    </CardFooter>
                                </form>
                            </Form>

                        </CardContent>
                    </Card>
                </TabsContent>


                <TabsContent value="register">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cadastro</CardTitle>
                            <CardDescription>
                                Change your password here. After saving, you'll be logged out.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col space-y-2 gap-2">

                            <Form {...formRegister}>
                                <form onSubmit={formRegister.handleSubmit(onSubmitRegister)} className="space-y-8">

                                    <FormField
                                        control={formRegister.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input id="email" placeholder="teste@gmail.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={formRegister.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Senha</FormLabel>
                                                <FormControl>
                                                    <Input id="password" type="password" placeholder="******" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={formRegister.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirmar Senha</FormLabel>
                                                <FormControl>
                                                    <Input id="confirmPassword" type="password" placeholder="******" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <CardFooter className="w-auto flex justify-end">
                                        <Button>Cadastrar</Button>
                                    </CardFooter>

                                </form>
                            </Form>

                        </CardContent>

                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default Login;
