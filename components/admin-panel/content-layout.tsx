import { Navbar } from "@/components/admin-panel/navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  session: object;
}

export function ContentLayout({ title, children, session }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} session={session} />
      <div className="container pt-8 pb-8 px-4 sm:px-8">{children}</div>
    </div>
  );
}
