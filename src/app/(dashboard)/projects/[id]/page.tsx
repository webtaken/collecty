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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ProjectActions } from "@/components/features/projects/project-actions";
import { SubscribersTable } from "@/components/features/projects/subscribers-table";
import { WidgetActiveSwitch } from "@/components/features/projects/widget-active-switch";
import { defaultInlineWidgetConfig } from "@/db/schema/projects";
import { WidgetGeneratorProvider } from "@/components/features/projects/widget-generator-context";
import { WidgetPreview } from "@/components/features/projects/widget-preview";
import { WidgetCustomizer } from "@/components/features/projects/widget-customizer";
import { ProjectHeader } from "@/components/features/projects/project-header";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Lock } from "lucide-react";
import { ProjectGuideBridge } from "@/components/features/guide/guide-bridge";

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

  return (
    <div className="space-y-6">
      <ProjectGuideBridge opened={true} subscriberCount={project.subscriberCount} />
      <WidgetGeneratorProvider
        projectId={project.id}
        initialPopupConfig={project.widgetConfig}
        initialInlineConfig={project.inlineWidgetConfig ?? defaultInlineWidgetConfig}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <ProjectHeader project={project} />
        </div>

        {/* Main Grid Layout: Left column (Preview + Subscribers) | Right column (Customization) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Preview and Subscribers */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preview (Install is now in modal) */}
            <WidgetPreview />

            {/* Row 2: Subscribers */}
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
            <WidgetCustomizer />
          </div>
        </div>
      </WidgetGeneratorProvider>
    </div>
  );
}
