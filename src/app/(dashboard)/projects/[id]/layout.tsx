import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { getProjectWithStats } from "@/actions/projects";
import { ProjectLeftSidebar } from "@/components/features/projects/project-left-sidebar";
import { ProjectRightSidebar } from "@/components/features/projects/project-right-sidebar";
import { ProjectGuideBridge } from "@/components/features/guide/guide-bridge";
import {
  WidgetContextProvider,
  type WidgetEntity,
} from "@/components/features/projects/widget-context";
import type { WidgetConfigUnified } from "@/db/schema/widgets";
import { ProjectHeader } from "@/components/features/projects/project-header";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
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
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-slate-50/50">
      <WidgetContextProvider
        projectId={project.id}
        initialWidgets={widgetEntities}
      >
        <ProjectGuideBridge
          opened={true}
          subscriberCount={project.subscriberCount}
        />

        {/* Left Sidebar - Commented out for testing right sidebar */}
        {/* <ProjectLeftSidebar project={project} /> */}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <main className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="container max-w-6xl mx-auto p-6 space-y-6">
              <ProjectHeader project={project} />
              {children}
            </div>
          </main>
        </div>

        {/* Right Sidebar */}
        <ProjectRightSidebar project={project} />
      </WidgetContextProvider>
    </div>
  );
}
