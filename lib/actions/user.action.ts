"use server";

import { signInFormSchema } from "../validator";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { auth, signIn, signOut } from "@/auth";

export async function signInWithCredentials(prevState: unknown, formData: FormData) {
    try {
        // Validate form data
        const user = signInFormSchema.parse({
            email: formData.get('email'),
            password: formData.get('password'),
        });
        await signIn('credentials', user);

        return { success: true, message: 'Signed in successfully' };
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
        return { success: false, message: 'Invalid email or password' };
    }
}

export async function signOutUser() {
    await signOut();
}