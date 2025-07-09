import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/admin-panel/user-nav";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import NotificationBell from "@/components/shared/notification-bell";
import { auth } from "@/auth";

interface NavbarProps {
  title: string;
  session: any;
}

export async function Navbar({ title, session }: NavbarProps) {
  const currentSession = session || await auth();
  
  return (
    <header className="w-full bg-background border-b border-border backdrop-blur supports-[backdrop-filter]:bg-background dark:bg-background">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center gap-2 lg:gap-4">
          <SheetMenu session={currentSession} />
          <h1 className="font-semibold text-lg">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <div className="flex items-center gap-2">
            {currentSession?.user?.id && (
              <NotificationBell userId={currentSession.user.id} />
            )}
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  );
}
