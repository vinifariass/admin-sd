import Footer from "@/components/footer";
import MainNav from "../admin/main-nav";
import UserButton from "@/components/shared/header/user-button";
import Link from "next/link";
import Image from 'next/image';
import AdminOverviewPage from "../admin/overview/page";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div >
            <main className="flex h-screen flex-col" >
                <div className="border-b container mx-auto">
                    <div className="flex items-center h-16 px-4">
                        <Link href='/' className='w-22'>
                            <Image src='/images/logo.png' height={48} width={48} alt='' />

                        </Link>
                        <MainNav className='mx-6' />
                        <div className="ml-auto items-center flex space-x-4">
                            <nav className="hidden md:flex w-full max-w-xs gap-1">
                                <UserButton />
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
                    {children}
                    <AdminOverviewPage />
                </div>
            </main>
            <Footer />
        </div>
    );
}