import { auth } from "@/lib/auth";
import { db, projects, subscribers, widgets } from "@/db";
import { eq, and, desc, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AnalyticsView } from "@/components/features/projects/analytics-view";

export default async function ProjectAnalyticsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();
    if (!session?.user?.id) {
        notFound();
    }

    const { id: projectId } = await params;

    // Verify project belongs to user
    const [project] = await db
        .select()
        .from(projects)
        .where(and(eq(projects.id, projectId), eq(projects.userId, session.user.id)));

    if (!project) {
        notFound();
    }

    // Fetch all widgets for this project
    const projectWidgets = await db
        .select()
        .from(widgets)
        .where(eq(widgets.projectId, projectId));

    // Fetch all subscribers for this project to build analytics
    const projectSubscribers = await db
        .select()
        .from(subscribers)
        .where(eq(subscribers.projectId, projectId))
        .orderBy(asc(subscribers.subscribedAt));

    // Process data for charts

    // 1. Over time (Line Chart)
    // We will pass raw data to client component and filter/group by time there
    const timeData = projectSubscribers.map((s) => ({
        date: s.subscribedAt.toISOString(),
        count: 1, // Will aggregate on client
    }));

    // 2. Devices by Location (Bar Chart)
    // We'll aggregate this on the server
    const locationsMap = new Map<string, { desktop: number; mobile: number; tablet: number; unknown: number }>();

    projectSubscribers.forEach((s) => {
        const meta = s.metadata as any;
        const country = meta?.country || meta?.countryCode || "Unknown";
        const deviceType = meta?.device?.type || "desktop"; // Default to desktop if userAgent didn't parse a mobile/tablet specific string

        if (!locationsMap.has(country)) {
            locationsMap.set(country, { desktop: 0, mobile: 0, tablet: 0, unknown: 0 });
        }
        const loc = locationsMap.get(country)!;
        if (deviceType === "mobile") loc.mobile++;
        else if (deviceType === "tablet") loc.tablet++;
        else if (deviceType === "desktop" || deviceType === "browser") loc.desktop++;
        else loc.unknown++;
    });

    const locationData = Array.from(locationsMap.entries())
        .map(([location, counts]) => ({
            location,
            ...counts,
            total: counts.desktop + counts.mobile + counts.tablet + counts.unknown
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10); // Top 10 locations

    // 3. Heatmap Data (Calendar)
    const heatmapData = projectSubscribers.map((s) => ({
        date: s.subscribedAt.toISOString().split('T')[0],
        widgetId: s.widgetId,
    }));

    return (
        <div className="space-y-6 pb-10">
            <AnalyticsView
                totalWidgets={projectWidgets.length}
                totalSubscribers={projectSubscribers.length}
                widgets={projectWidgets.map(w => ({ id: w.id, name: w.name }))}
                timeData={timeData}
                locationData={locationData}
                heatmapData={heatmapData}
            />
        </div>
    );
}
