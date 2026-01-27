"use server";

import { auth } from "@/lib/auth";
import { db, projects, widgets, leadMagnets } from "@/db";
import { eq, and, desc, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  type WidgetConfigUnified,
  defaultWidgetConfigUnified,
} from "@/db/schema/widgets";

// Validation schemas
const widgetConfigSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(500),
  buttonText: z.string().min(1).max(50),
  successMessage: z.string().min(1).max(255),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  showBranding: z.boolean(),
  // Popup options
  position: z
    .enum(["center", "bottom-right", "bottom-left", "top-right", "top-left"])
    .optional(),
  triggerType: z.enum(["delay", "exit-intent", "scroll", "click"]).optional(),
  triggerValue: z.number().min(0).max(100).optional(),
  // Inline options
  layout: z.enum(["horizontal", "vertical"]).optional(),
  placeholderText: z.string().max(100).optional(),
  borderRadius: z.number().min(0).max(50).optional(),
});

const createWidgetSchema = z.object({
  projectId: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  config: widgetConfigSchema.optional(),
});

const updateWidgetSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  config: widgetConfigSchema.optional(),
  isActive: z.boolean().optional(),
});

// Helper to verify project ownership
async function verifyProjectOwnership(projectId: string, userId: string) {
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)));

  return project;
}

// Helper to generate widget name
async function generateWidgetName(projectId: string): Promise<string> {
  const [result] = await db
    .select({ count: count() })
    .from(widgets)
    .where(eq(widgets.projectId, projectId));

  const widgetNumber = (result?.count || 0) + 1;
  return `Widget ${widgetNumber}`;
}

// Get all widgets for a project
export async function getWidgetsAction(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const project = await verifyProjectOwnership(projectId, session.user.id);
  if (!project) {
    throw new Error("Project not found");
  }

  const projectWidgets = await db
    .select({
      widget: widgets,
      leadMagnet: leadMagnets,
    })
    .from(widgets)
    .leftJoin(leadMagnets, eq(widgets.leadMagnetId, leadMagnets.id))
    .where(eq(widgets.projectId, projectId))
    .orderBy(desc(widgets.createdAt));

  return projectWidgets.map(({ widget, leadMagnet }) => ({
    ...widget,
    leadMagnet,
  }));
}

// Get a single widget by ID
export async function getWidgetAction(widgetId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const [result] = await db
    .select({
      widget: widgets,
      leadMagnet: leadMagnets,
    })
    .from(widgets)
    .leftJoin(leadMagnets, eq(widgets.leadMagnetId, leadMagnets.id))
    .where(eq(widgets.id, widgetId));

  if (!result) {
    return null;
  }

  const project = await verifyProjectOwnership(
    result.widget.projectId,
    session.user.id,
  );
  if (!project) {
    throw new Error("Project not found");
  }

  return {
    ...result.widget,
    leadMagnet: result.leadMagnet,
  };
}

// Get widget by ID (public - for embed routes)
export async function getWidgetByIdPublic(widgetId: string) {
  const [result] = await db
    .select({
      widget: widgets,
      leadMagnet: leadMagnets,
      project: projects,
    })
    .from(widgets)
    .leftJoin(leadMagnets, eq(widgets.leadMagnetId, leadMagnets.id))
    .innerJoin(projects, eq(widgets.projectId, projects.id))
    .where(eq(widgets.id, widgetId));

  if (!result) {
    return null;
  }

  // Check if both widget and project are active
  if (!result.widget.isActive || !result.project.isActive) {
    return null;
  }

  return {
    widget: result.widget,
    leadMagnet: result.leadMagnet,
    project: result.project,
  };
}

// Create a new widget
export async function createWidgetAction(data: {
  projectId: string;
  name?: string;
  config?: Partial<WidgetConfigUnified>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const validated = createWidgetSchema.parse(data);

  const project = await verifyProjectOwnership(
    validated.projectId,
    session.user.id,
  );
  if (!project) {
    throw new Error("Project not found");
  }

  // Generate name if not provided
  const widgetName =
    validated.name || (await generateWidgetName(validated.projectId));

  // Check if this is the first widget (should be default)
  const [existingCount] = await db
    .select({ count: count() })
    .from(widgets)
    .where(eq(widgets.projectId, validated.projectId));

  const isFirst = (existingCount?.count || 0) === 0;

  const [widget] = await db
    .insert(widgets)
    .values({
      projectId: validated.projectId,
      name: widgetName,
      config: { ...defaultWidgetConfigUnified, ...validated.config },
      isDefault: isFirst,
    })
    .returning();

  revalidatePath(`/projects/${validated.projectId}`);

  return widget;
}

// Update an existing widget
export async function updateWidgetAction(
  widgetId: string,
  data: {
    name?: string;
    config?: Partial<WidgetConfigUnified>;
    isActive?: boolean;
  },
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const validated = updateWidgetSchema.parse(data);

  // Get the widget
  const [existingWidget] = await db
    .select()
    .from(widgets)
    .where(eq(widgets.id, widgetId));

  if (!existingWidget) {
    throw new Error("Widget not found");
  }

  const project = await verifyProjectOwnership(
    existingWidget.projectId,
    session.user.id,
  );
  if (!project) {
    throw new Error("Project not found");
  }

  // Merge config if provided
  const newConfig = validated.config
    ? { ...(existingWidget.config as WidgetConfigUnified), ...validated.config }
    : undefined;

  const [updated] = await db
    .update(widgets)
    .set({
      ...(validated.name && { name: validated.name }),
      ...(newConfig && { config: newConfig }),
      ...(validated.isActive !== undefined && { isActive: validated.isActive }),
      updatedAt: new Date(),
    })
    .where(eq(widgets.id, widgetId))
    .returning();

  revalidatePath(`/projects/${existingWidget.projectId}`);

  return updated;
}

// Delete a widget
export async function deleteWidgetAction(widgetId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const [existingWidget] = await db
    .select()
    .from(widgets)
    .where(eq(widgets.id, widgetId));

  if (!existingWidget) {
    throw new Error("Widget not found");
  }

  const project = await verifyProjectOwnership(
    existingWidget.projectId,
    session.user.id,
  );
  if (!project) {
    throw new Error("Project not found");
  }

  // Don't allow deleting the last widget
  const [widgetCount] = await db
    .select({ count: count() })
    .from(widgets)
    .where(eq(widgets.projectId, existingWidget.projectId));

  if ((widgetCount?.count || 0) <= 1) {
    throw new Error("Cannot delete the last widget");
  }

  await db.delete(widgets).where(eq(widgets.id, widgetId));

  // If we deleted the default widget, set another as default
  if (existingWidget.isDefault) {
    const [nextWidget] = await db
      .select()
      .from(widgets)
      .where(eq(widgets.projectId, existingWidget.projectId))
      .limit(1);

    if (nextWidget) {
      await db
        .update(widgets)
        .set({ isDefault: true })
        .where(eq(widgets.id, nextWidget.id));
    }
  }

  revalidatePath(`/projects/${existingWidget.projectId}`);
}

// Set a widget as the default for its project
export async function setDefaultWidgetAction(widgetId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const [existingWidget] = await db
    .select()
    .from(widgets)
    .where(eq(widgets.id, widgetId));

  if (!existingWidget) {
    throw new Error("Widget not found");
  }

  const project = await verifyProjectOwnership(
    existingWidget.projectId,
    session.user.id,
  );
  if (!project) {
    throw new Error("Project not found");
  }

  // Remove default from all other widgets in the project
  await db
    .update(widgets)
    .set({ isDefault: false })
    .where(eq(widgets.projectId, existingWidget.projectId));

  // Set this widget as default
  await db
    .update(widgets)
    .set({ isDefault: true, updatedAt: new Date() })
    .where(eq(widgets.id, widgetId));

  revalidatePath(`/projects/${existingWidget.projectId}`);
}

// Attach or detach a lead magnet to a widget
export async function attachLeadMagnetAction(
  widgetId: string,
  leadMagnetId: string | null,
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const [existingWidget] = await db
    .select()
    .from(widgets)
    .where(eq(widgets.id, widgetId));

  if (!existingWidget) {
    throw new Error("Widget not found");
  }

  const project = await verifyProjectOwnership(
    existingWidget.projectId,
    session.user.id,
  );
  if (!project) {
    throw new Error("Project not found");
  }

  // Verify lead magnet exists before attaching
  if (leadMagnetId) {
    const [magnet] = await db
      .select()
      .from(leadMagnets)
      .where(eq(leadMagnets.id, leadMagnetId));

    if (!magnet) {
      throw new Error("Lead magnet not found");
    }
  }

  await db
    .update(widgets)
    .set({ leadMagnetId, updatedAt: new Date() })
    .where(eq(widgets.id, widgetId));

  revalidatePath(`/projects/${existingWidget.projectId}`);
}

// Toggle widget active status
export async function toggleWidgetStatusAction(widgetId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const [existingWidget] = await db
    .select()
    .from(widgets)
    .where(eq(widgets.id, widgetId));

  if (!existingWidget) {
    throw new Error("Widget not found");
  }

  const project = await verifyProjectOwnership(
    existingWidget.projectId,
    session.user.id,
  );
  if (!project) {
    throw new Error("Project not found");
  }

  await db
    .update(widgets)
    .set({
      isActive: !existingWidget.isActive,
      updatedAt: new Date(),
    })
    .where(eq(widgets.id, widgetId));

  revalidatePath(`/projects/${existingWidget.projectId}`);
}

// Get default widget for a project (for backward compatibility)
export async function getDefaultWidgetAction(projectId: string) {
  const [defaultWidget] = await db
    .select({
      widget: widgets,
      leadMagnet: leadMagnets,
    })
    .from(widgets)
    .leftJoin(leadMagnets, eq(widgets.leadMagnetId, leadMagnets.id))
    .where(and(eq(widgets.projectId, projectId), eq(widgets.isDefault, true)));

  if (!defaultWidget) {
    // Fallback to first widget if no default set
    const [firstWidget] = await db
      .select({
        widget: widgets,
        leadMagnet: leadMagnets,
      })
      .from(widgets)
      .leftJoin(leadMagnets, eq(widgets.leadMagnetId, leadMagnets.id))
      .where(eq(widgets.projectId, projectId))
      .limit(1);

    return firstWidget
      ? { ...firstWidget.widget, leadMagnet: firstWidget.leadMagnet }
      : null;
  }

  return {
    ...defaultWidget.widget,
    leadMagnet: defaultWidget.leadMagnet,
  };
}
