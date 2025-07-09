import Image from 'next/image';
import Link from 'next/link';
import MainNav from './main-nav';
import UserButton from '@/components/shared/header/user-button';
import AdminPanelLayout from '@/components/admin-panel/admin-panel-layout';
import { SheetMenu } from '@/components/admin-panel/sheet-menu';
import { ModeToggle } from '@/components/mode-toggle';
import { auth } from '@/auth';
export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const session = await auth()

    console.log(session) 

    return (
        <> <AdminPanelLayout
            session={session}>
            {/* Header */}
            <header className="border-bdark:bg-background bg-background backdrop-blur supports-[backdrop-filter]:bg-background dark:backdrop-blur">
                <div className="mx-4 sm:mx-8 flex h-14 items-center">
                    <SheetMenu session={session} />
                    {/* Logo */}
                    <Link href="/" className="w-22">
                        <Image 
                            src="/images/logo.png" 
                            height={48} 
                            width={48} 
                            alt="Logo" 
                            className="dark:invert dark:brightness-0 dark:contrast-100"
                        />
                    </Link>
                    {/* Botão da Conta */}
                    <div className="ml-auto items-center flex space-x-4">
                        <ModeToggle />
                        <nav className="hidden md:flex w-full max-w-xs gap-1">
                            <UserButton />
                        </nav>
                    </div>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <div className="flex-1 p-8 pt-6 container mx-auto overflow-y-auto">
                {children}
            </div>
        </AdminPanelLayout></>
    );
}