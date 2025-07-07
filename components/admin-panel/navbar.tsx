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
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu session={currentSession} />
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {currentSession?.user?.id && (
            <NotificationBell userId={currentSession.user.id} />
          )}
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
