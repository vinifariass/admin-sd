import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function RelatoriosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.tipo !== 'ADMIN') {
    redirect('/unauthorized');
  }

  return <>{children}</>;
}
