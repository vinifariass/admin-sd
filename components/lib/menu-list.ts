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

export function getMenuList(
  pathname: string,
  session: any,
): Group[] {
  let configGroup: Group[] = [];
  let configGroupSession: Group[] = [];

  if (session?.user?.tipo === "ADMIN") {
    configGroup = [
      {
        groupLabel: "Configurações",
        menus: [
          {
            href: "/admin/users",
            label: "Usuários",
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

    if (session?.user?.tipo) {
      configGroupSession = [
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
                },
                {
                  href: "/admin/funcionarios",
                  label: "Funcionario"
                }
              ]
            },

          ]
        },
      ]
    }

    if(session?.user?.tipo === "FUNCIONARIO" || session?.user?.tipo === "MORADOR") {
      configGroupSession = [
        {
          groupLabel: "Gerenciador",
          menus: [
            {
              href: "",
              label: "Condomínio",
              icon: SquarePen,
              submenus: [
                {
                  href: "/admin/agendamentos",
                  label: "Agendamentos"
                },
                {
                  href: "/admin/visitantes",
                  label: "Visitantes"
                },
                {
                  href: "/admin/encomendas",
                  label: "Encomendas"
                },
                {
                  href: "/admin/servicos",
                  label: "Funcionario"
                }
              ]
            },

          ]
        },
      ]
    }
  }
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
    ...configGroupSession,
    ...configGroup

  ];
}
