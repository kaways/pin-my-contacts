import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface AuthTabsProps {
    loginForm: React.ReactNode;
    registerForm: React.ReactNode;
}

export const AuthTabs = ({ loginForm, registerForm }: AuthTabsProps) => {
    return (
        <Tabs defaultValue="login" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Cadastro</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
                <Card>
                    <CardContent className="pt-6">{loginForm}</CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="register">
                <Card>
                    <CardHeader>
                        <CardTitle>Cadastro</CardTitle>
                        <CardDescription>Crie sua conta para começar</CardDescription>
                    </CardHeader>
                    <CardContent>{registerForm}</CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
};