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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ProjectActions } from "@/components/features/projects/project-actions";
import { SubscribersTable } from "@/components/features/projects/subscribers-table";
import { ProjectHeader } from "@/components/features/projects/project-header";
import { ProjectGuideBridge } from "@/components/features/guide/guide-bridge";
import {
  WidgetContextProvider,
  type WidgetEntity,
} from "@/components/features/projects/widget-context";
import { WidgetPreviewNew } from "@/components/features/projects/widget-preview-new";
import { WidgetCustomizerNew } from "@/components/features/projects/widget-customizer-new";
import type { WidgetConfigUnified } from "@/db/schema/widgets";

export default async function ProjectDetailPage({
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

  // Transform widgets to match WidgetEntity type
  const widgetEntities: WidgetEntity[] = (project.widgets || []).map((w) => ({
    id: w.id,
    projectId: w.projectId,
    name: w.name,
    config: w.config as WidgetConfigUnified,
    leadMagnetId: w.leadMagnetId,
    leadMagnet: w.leadMagnet ?? null,
    isDefault: w.isDefault,
    isActive: w.isActive,
    createdAt: w.createdAt,
    updatedAt: w.updatedAt,
  }));

  return (
    <div className="space-y-6">
      <ProjectGuideBridge
        opened={true}
        subscriberCount={project.subscriberCount}
      />
      <WidgetContextProvider
        projectId={project.id}
        initialWidgets={widgetEntities}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <ProjectHeader project={project} />
        </div>

        {/* Main Grid Layout: Left column (Preview + Subscribers) | Right column (Customization) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Preview and Subscribers */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preview with Widget Selector */}
            <WidgetPreviewNew />

            {/* Subscribers */}
            <Card>
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>Recent Subscribers</CardTitle>
                  <Badge className="bg-black text-white px-3 py-1 text-sm font-semibold">
                    {project.subscriberCount}
                  </Badge>
                </div>
                <CardDescription>
                  Emails collected through your widget
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SubscribersTable
                  subscribers={project.recentSubscribers}
                  projectId={project.id}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right: Customization */}
          <div className="space-y-6">
            <WidgetCustomizerNew />
          </div>
        </div>
      </WidgetContextProvider>
    </div>
  );
}
