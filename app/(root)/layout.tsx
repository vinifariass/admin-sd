import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { auth } from "@/auth";
import React from "react";
import Header from "@/components/shared/header/header";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const session = await auth()
    return (
        <>
            <AdminPanelLayout
                session={session}>
                <Header session={session} showLogo={true} useOriginalComponents={true} />
                <div className="flex-1 p-8 pt-6 container mx-auto overflow-y-auto">
                    {children}
                </div>
            </AdminPanelLayout>
        </>
    );
}