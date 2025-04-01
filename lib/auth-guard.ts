import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
    const session = await auth();
    if (session?.user?.tipo !== 'ADMIN') {
        redirect('/unauthorized');
    }
}