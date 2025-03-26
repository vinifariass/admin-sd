import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/admin/overview",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Gerenciador",
      menus: [
        {
          href: "",
          label: "Condomínio",
          icon: SquarePen,
          submenus: [
            {
              href: "/admin/moradores",
              label: "Moradores"
            },
            {
              href: "/admin/parkings",
              label: "Vagas"
            },
            {
              href: "/admin/encomendas",
              label: "Encomendas"
            },
            {
              href: "/admin/servicos",
              label: "Serviços"
            },
            {
              href: "/admin/visitantes",
              label: "Visitantes"
            },
            {
              href: "/admin/agendamentos",
              label: "Agendamentos"
            }
          ]
        },
        {
          href: "/categories",
          label: "Categories",
          icon: Bookmark
        },
        {
          href: "/tags",
          label: "Tags",
          icon: Tag
        }
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/users",
          label: "Users",
          icon: Users
        },
        {
          href: "/account",
          label: "Account",
          icon: Settings
        }
      ]
    }
  ];
}
