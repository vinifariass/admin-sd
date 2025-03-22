'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";

const links = [
    {
        title: 'Overview',
        href: '/admin/overview'
    },
    {
        title: 'Vagas',
        href: '/admin/parkings',
    },
    {
        title: 'Moradores',
        href: '/admin/moradores',
    },
    {
        title: 'Funcionários',
        href: '/admin/funcionarios',
    },
    {
        title: 'Serviços',
        href: '/admin/servicos',
    },
]

const MainNav = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {

    const pathname = usePathname();

    return (<nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>{links.map((item) => (
        <Link key={item.href} href={item.href} className={cn('text-sm font-medium transition-colors hover:text-primary', pathname.includes(item.href) ? '' : 'text-muted-foreground')}>
            {item.title}
            </Link>
    ))}</nav>);
}

export default MainNav;