import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { getProjectWithStats } from "@/actions/projects";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubscribersTable } from "@/components/features/projects/subscribers-table";

export default async function SubscribersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) {
    redirect("/login");
  }

  const project = await getProjectWithStats(id, session.user.id);

  if (!project) {
    notFound();
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b">
        <div className="flex items-center gap-2">
          <CardTitle>Subscribers</CardTitle>
          <Badge className="bg-black text-white px-3 py-1 text-sm font-semibold">
            {project.subscriberCount}
          </Badge>
        </div>
        <CardDescription>
          Manage and export your collected leads
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <SubscribersTable
          subscribers={project.recentSubscribers}
          projectId={project.id}
        />
      </CardContent>
    </Card>
  );
}
