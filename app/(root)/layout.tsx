import Footer from "@/components/footer";
import MainNav from "../admin/main-nav";
import UserButton from "@/components/shared/header/user-button";
import Link from "next/link";
import Image from 'next/image';
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <AdminPanelLayout>{children}

            </AdminPanelLayout>


        </>
    );
}