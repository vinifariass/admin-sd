'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconDashboard, IconUsers, IconBuilding, IconFile, IconSettings } from '@/components/icons';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { MdDashboard } from "react-icons/md";
import { FaCog, FaFileAlt } from "react-icons/fa";
import { HiUsers } from "react-icons/hi";
import { TbBuilding } from "react-icons/tb";
const links = [
    /*  {
         title: 'Visão Geral',
         href: '/admin/overview'
     },
     {
         title: 'Gestão de Condomínio',
         subItems: [
             { title: 'Moradores', href: '/admin/moradores' },
             { title: 'Funcionários', href: '/admin/funcionarios' },
             { title: 'Vagas de Estacionamento', href: '/admin/parkings' },
             { title: 'Serviços', href: '/admin/servicos' },
         ],
     },
     {
         title: 'Encomendas',
         href: '/admin/encomendas',
     }, */

    {
        title: 'Dashboard',
        href: '/admin/overview',
        icon: MdDashboard,
    },
    {
        title: 'Moradores',
        href: '/admin/moradores',
        icon: HiUsers,
    },
    {
        title: 'Condomínio',
        href: '/admin/condominio',
        icon: TbBuilding,
        subItems: [
            { title: 'Moradores', href: '/admin/moradores' },
            { title: 'Funcionários', href: '/admin/funcionarios' },
            { title: 'Vagas de Estacionamento', href: '/admin/parkings' },
            { title: 'Serviços', href: '/admin/servicos' },
        ],
    },
    /* {
        title: 'Documentos',
        href: '/admin/documentos',
        icon: FaFileAlt,
    },
    {
        title: 'Configurações',
        href: '/admin/configuracoes',
        icon: FaCog,
    }, */

]

const MainNav = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {

    const pathname = usePathname();

    return (
        // <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
        //     {links.map((item) => {
        //         if (item.subItems) {
        //             return (
        //                 <DropdownMenu key={item.title}>
        //                     <DropdownMenuTrigger asChild>
        //                         <button className="text-sm font-medium transition-colors hover:text-primary">
        //                             {item.title}
        //                         </button>
        //                     </DropdownMenuTrigger>
        //                     <DropdownMenuContent align="start">
        //                         {item.subItems.map((subItem) => (
        //                             <DropdownMenuItem key={subItem.href} asChild>
        //                                 <Link
        //                                     href={subItem.href}
        //                                     className={cn(
        //                                         'text-sm font-medium transition-colors hover:text-primary',
        //                                         pathname.includes(subItem.href) ? '' : 'text-muted-foreground'
        //                                     )}
        //                                 >
        //                                     {subItem.title}
        //                                 </Link>
        //                             </DropdownMenuItem>
        //                         ))}
        //                     </DropdownMenuContent>
        //                 </DropdownMenu>
        //             );
        //         }

        //         return (
        //             <Link
        //                 key={item.href}
        //                 href={item.href}
        //                 className={cn(
        //                     'text-sm font-medium transition-colors hover:text-primary',
        //                     pathname.includes(item.href) ? '' : 'text-muted-foreground'
        //                 )}
        //             >
        //                 {item.title}
        //             </Link>
        //         );
        //     })}
        // </nav>

        <SidebarProvider>
            <Sidebar>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Application</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {links.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <a href={item.href}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </SidebarProvider>

    );
};

export default MainNav;