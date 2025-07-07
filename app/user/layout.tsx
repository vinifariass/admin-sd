import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import UserNavbar from "@/components/user/user-navbar";

export const metadata: Metadata = {
    title: {
        template: '%s | Admin SD',
        default: 'Perfil do Usuário | Admin SD'
    },
    description: 'Área do usuário do sistema Admin SD',
};

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    
    if (!session?.user) {
        redirect('/sign-in');
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <UserNavbar user={session.user} />
            <main className="pt-16">
                {children}
            </main>
        </div>
    );
}
