import {
  Users,
  Settings,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  BookOpen,
  HelpCircle,
  FileText
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

export function getMenuList(
  pathname: string,
  session: any
): Group[] {
  const userType = session?.user?.tipo;

  const defaultGroup: Group = {
    groupLabel: "",
    menus: [
      {
        href: "/admin/overview",
        label: "Dashboard",
        icon: LayoutGrid,
        active: pathname === "/admin/overview",
      }
    ]
  };

  const adminConfigGroup: Group | null = userType === "ADMIN"
    ? {
        groupLabel: "Configurações",
        menus: [
          {
            href: "/admin/users",
            label: "Usuários",
            icon: Users,
            active: pathname.includes("/admin/users")
          },
          {
            href: "/admin/relatorios",
            label: "Relatórios",
            icon: FileText,
            active: pathname.includes("/admin/relatorios")
          },
          {
            href: "/account",
            label: "Account",
            icon: Settings,
            active: pathname.includes("/account")
          }
        ]
      }
    : null;

  const managerGroup: Group | null =
    ["ADMIN", "FUNCIONARIO", "MORADOR"].includes(userType)
      ? {
          groupLabel: "Gerenciador",
          menus: [
            {
              href: "",
              label: "Condomínio",
              icon: SquarePen,
              active: pathname.startsWith("/admin/"),
              submenus: [
                { href: "/admin/moradores", label: "Moradores" },
                { href: "/admin/parkings", label: "Vagas" },
                { href: "/admin/encomendas", label: "Encomendas" },
                { href: "/admin/boletos", label: "Boletos" },
                { href: "/admin/servicos", label: "Serviços" },
                { href: "/admin/visitantes", label: "Visitantes" },
                { href: "/admin/agendamentos", label: "Agendamentos" },
                { href: "/admin/funcionarios", label: "Funcionários" },
                { href: "/admin/gastos", label: "Gastos" },
              ]
              .filter((submenu) => {
                if (["FUNCIONARIO", "MORADOR"].includes(userType)) {
                  return ["Agendamentos", "Visitantes", "Encomendas", "Funcionários","Vagas", "Boletos"]
                    .includes(submenu.label);
                }
                return true;
              })
              .map((submenu) => ({
                ...submenu,
                active: pathname.includes(submenu.href)
              }))
            }
          ]
        }
      : null;

  const helpGroup: Group = {
    groupLabel: "Ajuda",
    menus: [
      {
        href: "/admin/documentacao",
        label: "Como Usar",
        icon: BookOpen,
        active: pathname.includes("/admin/documentacao")
      },
      {
        href: "/admin/suporte",
        label: "Suporte",
        icon: HelpCircle,
        active: pathname.includes("/admin/suporte")
      }
    ]
  };

  return [
    defaultGroup,
    ...(managerGroup ? [managerGroup] : []),
    ...(adminConfigGroup ? [adminConfigGroup] : []),
    helpGroup
  ];
}
