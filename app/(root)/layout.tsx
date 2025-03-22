import Footer from "@/components/footer";
import MainNav from "../admin/main-nav";
import UserButton from "@/components/shared/header/user-button";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen flex-col">
            <main className="flex-1 wrapper">
                <div className="border-b container mx-auto">
                    <div className="flex items-center h-16 px-4">
                        {children}

                        <MainNav className='mx-6' />

                        <div className="ml-auto items-center flex space-x-4">
                            <nav className="hidden md:flex w-full max-w-xs gap-1">
                                <UserButton />
                            </nav>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}