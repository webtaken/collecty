import { auth } from "@/lib/auth";
import { db, projects, subscribers } from "@/db";
import { eq, count, desc } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getDashboardStats(userId: string) {
  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId));

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
      })
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
          : undefined
      )
      .orderBy(desc(subscribers.subscribedAt))
      .limit(5);

    recentSubscribers = recentSubs.map((sub) => ({
      email: sub.email,
      subscribedAt: sub.subscribedAt,
      projectName: userProjects.find((p) => p.id === sub.projectId)?.name || "Unknown",
    }));
  }

  return {
    totalProjects: userProjects.length,
    activeProjects: userProjects.filter((p) => p.isActive).length,
    totalSubscribers,
    recentSubscribers,
  };
}

export default async function DashboardPage() {
  const session = await auth();
  const stats = await getDashboardStats(session!.user!.id!);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">
          Welcome back, {session?.user?.name?.split(" ")[0] || "there"}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Projects
            </CardTitle>
            <svg
              className="h-4 w-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-slate-500 mt-1">
              {stats.activeProjects} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Subscribers
            </CardTitle>
            <svg
              className="h-4 w-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubscribers}</div>
            <p className="text-xs text-slate-500 mt-1">Across all projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Active Widgets
            </CardTitle>
            <svg
              className="h-4 w-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-slate-500 mt-1">Currently collecting</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/projects/new">
              <Button className="w-full justify-start" variant="outline">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create New Project
              </Button>
            </Link>
            <Link href="/projects">
              <Button className="w-full justify-start" variant="outline">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                View All Projects
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Subscribers</CardTitle>
            <CardDescription>Latest email signups</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentSubscribers.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">
                No subscribers yet. Create a project to start collecting emails!
              </p>
            ) : (
              <div className="space-y-3">
                {stats.recentSubscribers.map((sub, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{sub.email}</p>
                      <p className="text-xs text-slate-500">{sub.projectName}</p>
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(sub.subscribedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

