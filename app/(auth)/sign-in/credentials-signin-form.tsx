'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signInWithCredentials } from "@/lib/actions/user.action";
import { useSearchParams } from "next/navigation";

const CredentialsSignInForm = () => {
    const [data, action] = useActionState(signInWithCredentials, {
        success: false,
        message: ''
    });

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const SignInButton = () => {
        const { pending } = useFormStatus();
        return (
            <Button className="w-full" variant='default' disabled={pending}>
                {pending ? 'Entrando...' : 'Entrar'}
            </Button>
        );
    }

    return (
        <form action={action}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <div className="space-y-6">
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" name="email" placeholder="Email" required autoComplete="email"
                        defaultValue={signInDefaultValues.email} />
                </div>

                <div>
                    <Label htmlFor="password">Senha</Label>
                    <Input type="password" id="password" name="password" placeholder="Senha" required autoComplete="password"
                        defaultValue={signInDefaultValues.password} />
                </div>
                <SignInButton />

                {data && !data.success && (
                    <div className="text-center text-destructive">
                        {data.message} </div>
                )}


                <div className="text-sm text-center text-muted-foreground">
                    Não tem uma conta? {' '}
                    <Link href="/sign-up" target="_self" className="link">Cadastrar</Link>
                </div>
            </div>
        </form>);
}

export default CredentialsSignInForm;