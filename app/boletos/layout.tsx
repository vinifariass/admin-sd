import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import UserNavbar from "@/components/user/user-navbar";

export const metadata: Metadata = {
    title: {
        template: '%s | Admin SD',
        default: 'Meus Boletos | Admin SD'
    },
    description: 'Consulte e gerencie seus boletos do condomínio',
};

export default async function BoletosLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    
    if (!session?.user) {
        redirect('/sign-in');
    }

    return (
        <div className="min-h-screen bg-background">
            <UserNavbar user={session.user} />
            <main className="pt-16">
                {children}
            </main>
        </div>
    );
}
