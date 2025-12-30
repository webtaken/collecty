import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { getProjectWithStats } from "@/actions/projects";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProjectSettingsForm } from "@/components/features/projects/project-settings-form";
import { WidgetCustomizer } from "@/components/features/projects/widget-customizer";
import { defaultInlineWidgetConfig } from "@/db/schema/projects";

export default async function ProjectSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;
  const project = await getProjectWithStats(id, session!.user!.id!);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/projects/${project.id}`}>
          <Button variant="ghost" size="icon">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Project Settings
          </h1>
          <p className="text-slate-600">{project.name}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Update your project details and configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectSettingsForm project={project} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Widget Customization</CardTitle>
              <CardDescription>
                Customize the appearance of your popup and inline widgets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WidgetCustomizer
                projectId={project.id}
                initialConfig={project.widgetConfig}
                initialInlineConfig={
                  project.inlineWidgetConfig ?? defaultInlineWidgetConfig
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
