import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { getProjectWithStats } from "@/actions/projects";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProjectSettingsForm } from "./project-settings-form";

export default async function ProjectSettingsPage({
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
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Project Settings</CardTitle>
          <CardDescription>
            Manage your project details and configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectSettingsForm project={project} />
        </CardContent>
      </Card>
    </div>
  );
}
