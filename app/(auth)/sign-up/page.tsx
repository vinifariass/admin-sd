import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from 'next/navigation';
import SignUpForm from "./sign-up-form";
import { ModeToggle } from "@/components/mode-toggle";

export const metadata: Metadata = {
    title: 'cadastro',
};

const SignUpPage = async (props: {
    searchParams: Promise<{
        callbackUrl: string;
    }>;
}) => {

    const { callbackUrl } = await props.searchParams;

    const session = await auth();

    if (session) {
        return redirect(callbackUrl || '/');
    }
    return (<div className="w-full max-w-md mx-auto">
        <div className="absolute top-4 right-4">
            <ModeToggle />
        </div>
        <Card>
            <CardHeader className="space-y-4">
                <Link href="/" className="flex-center">
                    <Image 
                        src='/images/logo.png' 
                        width={100} 
                        height={100} 
                        alt={`${APP_NAME} logo`} 
                        priority={true}
                        className="dark:invert dark:brightness-0 dark:contrast-100" 
                    />
                </Link>
                <CardTitle className="text-center">Criar Contar</CardTitle>
                <CardDescription className="text-center">
                    Preencha as informações abaixo para criar uma conta
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Sign up form */}
                <SignUpForm />
            </CardContent>
        </Card>
    </div>);
}

export default SignUpPage;