import Footer from "@/components/footer";
import MainNav from "../admin/main-nav";
import UserButton from "@/components/shared/header/user-button";
import Link from "next/link";
import Image from 'next/image';
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import { auth } from "@/auth";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const session = await auth()

    console.log(session)
    return (
        <>
            <AdminPanelLayout
                session={session}>
                <header className="border-b container mx-auto flex items-center h-16 px-4">
                    <SheetMenu session={session}/>
                    {/* Logo */}
                    <Link href="/" className="w-22">
                        <Image src="/images/logo.png" height={48} width={48} alt="Logo" />
                    </Link>
                    {/* Botão da Conta */}
                    <div className="ml-auto items-center flex space-x-4">
                        <nav className="hidden md:flex w-full max-w-xs gap-1">
                            <UserButton />
                        </nav>
                    </div>
                </header>
                <div className="flex-1 p-8 pt-6 container mx-auto overflow-y-auto">
                    {children}
                </div>
            </AdminPanelLayout>


        </>
    );
}