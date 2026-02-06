import { auth } from "@/lib/auth";
import { db, projects, subscribers } from "@/db";
import { eq, count, desc } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { DashboardGuideBridge } from "@/components/features/guide/guide-bridge";
import {
  ArrowRight,
  Plus,
  Users,
  Activity,
  Layout,
  ExternalLink,
  Clock,
} from "lucide-react";

async function getDashboardStats(userId: string) {
  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId))
    .orderBy(desc(projects.createdAt));

  const projectIds = userProjects.map((p) => p.id);

  let totalSubscribers = 0;
  let recentSubscribers: Array<{
    email: string;
    subscribedAt: Date;
    projectName: string;
  }> = [];

  if (projectIds.length > 0) {
    const subscriberCounts = await Promise.all(
      projectIds.map(async (projectId) => {
        const result = await db
          .select({ count: count() })
          .from(subscribers)
          .where(eq(subscribers.projectId, projectId));
        return result[0]?.count || 0;
      }),
    );

    totalSubscribers = subscriberCounts.reduce((acc, curr) => acc + curr, 0);

    // Get recent subscribers with project names
    const recentSubs = await db
      .select({
        email: subscribers.email,
        subscribedAt: subscribers.subscribedAt,
        projectId: subscribers.projectId,
      })
      .from(subscribers)
      .where(
        projectIds.length > 0
          ? eq(subscribers.projectId, projectIds[0])
          : undefined,
      )
      .orderBy(desc(subscribers.subscribedAt))
      .limit(5);

    recentSubscribers = recentSubs.map((sub) => ({
      email: sub.email,
      subscribedAt: sub.subscribedAt,
      projectName:
        userProjects.find((p) => p.id === sub.projectId)?.name || "Unknown",
    }));
  }

  return {
    totalProjects: userProjects.length,
    activeProjects: userProjects.filter((p) => p.isActive).length,
    totalSubscribers,
    recentSubscribers,
    latestProjects: userProjects.slice(0, 3),
  };
}

export default async function DashboardPage() {
  const session = await auth();
  const stats = await getDashboardStats(session!.user!.id!);
  const userName = session?.user?.name?.split(" ")[0] || "there";
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      <DashboardGuideBridge
        totalProjects={stats.totalProjects}
        totalSubscribers={stats.totalSubscribers}
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {userName}!
          </h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
            {currentDate}
          </p>
        </div>
        <Link href="/projects/new">
          <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 transition-all hover:scale-105 active:scale-95">
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
              Total Projects
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layout className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats.totalProjects}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <Badge
                variant="secondary"
                className="h-5 px-1.5 text-[10px] bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                {stats.activeProjects} Active
              </Badge>
              <span className="text-slate-400">projects running</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
              Total Subscribers
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats.totalSubscribers}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Across all available projects
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
              Active Widgets
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats.activeProjects}
            </div>
            <p className="text-xs text-slate-500 mt-1 text-emerald-600 font-medium">
              Currently collecting data
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-7">
        {/* Main Content Area (Projects & Quick Actions) */}
        <div className="md:col-span-4 space-y-8">
          {/* Latest Projects */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                Latest Projects
              </h2>
              <Link
                href="/projects"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 hover:gap-2 transition-all"
              >
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {stats.latestProjects.length > 0 ? (
              <div className="space-y-3">
                {stats.latestProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="block group"
                  >
                    <div className="bg-white border boundary-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg group-hover:from-indigo-50 group-hover:to-indigo-100 group-hover:text-indigo-600 transition-all">
                          {project.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900 group-hover:text-indigo-700 transition-colors">
                            {project.name}
                          </h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            {project.domain || "No domain connected"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div
                          className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                            project.isActive
                              ? "bg-green-50 text-green-700 ring-1 ring-green-600/10"
                              : "bg-slate-50 text-slate-600 ring-1 ring-slate-400/10"
                          }`}
                        >
                          {project.isActive ? "Active" : "Inactive"}
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center">
                <p className="text-slate-500 text-sm mb-4">
                  You haven't created any projects yet.
                </p>
                <Link href="/projects/new">
                  <Button variant="outline" size="sm">
                    Create your first project
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/projects/new" className="block">
                <div className="bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer h-full group">
                  <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Plus className="w-4 h-4" />
                  </div>
                  <h3 className="font-medium text-slate-900 mb-1">
                    New Project
                  </h3>
                  <p className="text-xs text-slate-500">
                    Create a new collection widget
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar (Recent Activity) */}
        <div className="md:col-span-3">
          <Card className="h-full border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Recently Added
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-600 font-normal"
                >
                  Last 5
                </Badge>
              </CardTitle>
              <CardDescription>Latest email subscribers</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recentSubscribers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-3 text-slate-300">
                    <Users className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-slate-500">No subscribers yet.</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Share your projects to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {stats.recentSubscribers.map((sub, i) => (
                    <div key={i} className="flex items-start gap-3 group">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-medium text-xs shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        {sub.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {sub.email}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs text-slate-500 truncate max-w-[120px]">
                            {sub.projectName}
                          </p>
                          <span className="text-[10px] text-slate-300">•</span>
                          <p className="text-xs text-slate-400">
                            {new Date(sub.subscribedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
