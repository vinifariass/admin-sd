import Link from "next/link";
import Image from 'next/image';
import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import { ModeToggle } from "@/components/mode-toggle";
import UserButton from "@/components/shared/header/user-button";
import NotificationBell from "@/components/shared/notification-bell";
import ThemeToggle from "@/components/shared/header/ThemeToggle";

interface HeaderProps {
  session: any;
  title?: string;
  showLogo?: boolean;
  logoSrc?: string;
  logoAlt?: string;
  logoSize?: { width: number; height: number };
  showNotifications?: boolean;
  useOriginalComponents?: boolean; // Para usar os componentes originais (UserButton + ThemeToggle)
}

export default function Header({ 
  session, 
  title,
  showLogo = false, 
  logoSrc = "/images/logo.png", 
  logoAlt = "Logo",
  logoSize = { width: 48, height: 48 },
  showNotifications = true,
  useOriginalComponents = false
}: HeaderProps) {
  return (
    <header className="border-b dark:bg-background bg-background border-border backdrop-blur supports-[backdrop-filter]:bg-background dark:backdrop-blur">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center gap-2 lg:gap-4">
          <SheetMenu session={session} />
          {showLogo && (
            <Link href="/" className="w-22">
              <Image
                src={logoSrc}
                height={logoSize.height}
                width={logoSize.width}
                alt={logoAlt}
                className="dark:invert dark:brightness-0 dark:contrast-100"
              />
            </Link>
          )}
          {title && <h1 className="font-semibold text-lg">{title}</h1>}
        </div>
        <div className="flex flex-1 items-center justify-end">
          <div className="flex items-center space-x-2">
            {showNotifications && session?.user?.id && (
              <NotificationBell userId={session.user.id} />
            )}
            {useOriginalComponents ? (
              <>
                <ThemeToggle />
                <nav className="flex gap-1">
                  <UserButton />
                </nav>
              </>
            ) : (
              <>
                <ModeToggle />
                <UserButton />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
