import { DefaultSession } from "next-auth";

declare module 'next-auth' {
    export interface Session extends DefaultSession {
        user: {
            tipo: string;
        } & DefaultSession['user'];
        // We are not going to change the other properties of the user object
    }
}