import Footer from "@/components/footer";
import MainNav from "../admin/main-nav";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen flex-col">
            <main className="flex-1 wrapper">
                {children}

                <MainNav className='mx-6' />


            </main>
            <Footer />
        </div>
    );
}