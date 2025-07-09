import { Navbar } from "@/components/admin-panel/navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  session: object;
}

export function ContentLayout({ title, children, session }: ContentLayoutProps) {
  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-10">
        <Navbar title={title} session={session} />
      </div>
      <div className="pt-14">
        <div className="container pt-8 pb-8 px-4 sm:px-8">{children}</div>
      </div>
    </div>
  );
}
