import { Sidebar } from "@/components/features/dashboard/sidebar";
import { Header } from "@/components/features/dashboard/header";
import { auth } from "@/lib/auth";
import { db, projects } from "@/db";
import { eq, count } from "drizzle-orm";

async function getProjectCount(userId: string) {
  const [result] = await db
    .select({ count: count() })
    .from(projects)
    .where(eq(projects.userId, userId));

  return result?.count || 0;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const projectCount = session?.user?.id ? await getProjectCount(session.user.id) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar projectCount={projectCount} />
      <div className="lg:pl-64">
        <Header />
        <main className="py-6 px-4 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

