import { Sidebar } from "@/components/features/dashboard/sidebar";
import { Header } from "@/components/features/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="py-6 px-4 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

