"use server";

import { auth } from "@/lib/auth";
import { db, projects, widgets, leadMagnets } from "@/db";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { RichTextContent } from "@/db/schema/lead-magnets";

// Validation schemas
const createLeadMagnetSchema = z.object({
  description: z.any().optional(), // Rich text JSON from Tiptap
  previewText: z.string().optional(),
});

const updateLeadMagnetSchema = z.object({
  description: z.any().optional(),
  previewText: z.string().optional(),
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

// Helper to verify lead magnet ownership through widget -> project chain
async function verifyLeadMagnetOwnership(leadMagnetId: string, userId: string) {
  // Find the widget that has this lead magnet
  const [widget] = await db
    .select()
    .from(widgets)
    .where(eq(widgets.leadMagnetId, leadMagnetId));

  if (!widget) {
    // Lead magnet exists but is not linked to any widget - check if lead magnet exists
    const [magnet] = await db
      .select()
      .from(leadMagnets)
      .where(eq(leadMagnets.id, leadMagnetId));

    return { magnet, widget: null, project: null };
  }

  // Verify project ownership through the widget
  const project = await verifyProjectOwnership(widget.projectId, userId);

  const [magnet] = await db
    .select()
    .from(leadMagnets)
    .where(eq(leadMagnets.id, leadMagnetId));

  return { magnet, widget, project };
}

// Create a new lead magnet (standalone, can be linked to a widget later)
export async function createLeadMagnetAction(data: {
  description?: RichTextContent | null;
  previewText?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const validated = createLeadMagnetSchema.parse(data);

  const [leadMagnet] = await db
    .insert(leadMagnets)
    .values({
      description: data.description,
      previewText: validated.previewText || null,
    })
    .returning();

  return leadMagnet;
}

// Update an existing lead magnet
export async function updateLeadMagnetAction(
  leadMagnetId: string,
  data: {
    description?: RichTextContent | null;
    previewText?: string;
    isActive?: boolean;
  },
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const validated = updateLeadMagnetSchema.parse(data);

  // Get the lead magnet and verify ownership through widget
  const { magnet, widget, project } = await verifyLeadMagnetOwnership(
    leadMagnetId,
    session.user.id,
  );

  if (!magnet) {
    throw new Error("Lead magnet not found");
  }

  // If linked to a widget, verify ownership through project
  if (widget && !project) {
    throw new Error("Unauthorized: You don't own this lead magnet");
  }

  const [updated] = await db
    .update(leadMagnets)
    .set({
      ...(data.description !== undefined && { description: data.description }),
      ...(validated.previewText !== undefined && {
        previewText: validated.previewText || null,
      }),
      ...(validated.isActive !== undefined && { isActive: validated.isActive }),
      updatedAt: new Date(),
    })
    .where(eq(leadMagnets.id, leadMagnetId))
    .returning();

  if (project) {
    revalidatePath(`/projects/${project.id}`);
    revalidatePath(`/projects/${project.id}/lead-magnets`);
  }

  return updated;
}

// Delete a lead magnet
export async function deleteLeadMagnetAction(leadMagnetId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Get the lead magnet and verify ownership
  const { magnet, widget, project } = await verifyLeadMagnetOwnership(
    leadMagnetId,
    session.user.id,
  );

  if (!magnet) {
    throw new Error("Lead magnet not found");
  }

  // If linked to a widget, verify ownership through project
  if (widget && !project) {
    throw new Error("Unauthorized: You don't own this lead magnet");
  }

  await db.delete(leadMagnets).where(eq(leadMagnets.id, leadMagnetId));

  if (project) {
    revalidatePath(`/projects/${project.id}`);
    revalidatePath(`/projects/${project.id}/lead-magnets`);
  }
}

// Get all lead magnets for a project (through widgets)
export async function getLeadMagnetsForProjectAction(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const project = await verifyProjectOwnership(projectId, session.user.id);
  if (!project) {
    throw new Error("Project not found");
  }

  // Get all widgets for this project that have lead magnets
  const projectWidgets = await db
    .select({
      widget: widgets,
      leadMagnet: leadMagnets,
    })
    .from(widgets)
    .leftJoin(leadMagnets, eq(widgets.leadMagnetId, leadMagnets.id))
    .where(eq(widgets.projectId, projectId))
    .orderBy(desc(leadMagnets.createdAt));

  // Return only the lead magnets (filtering out nulls)
  return projectWidgets
    .filter((row) => row.leadMagnet !== null)
    .map((row) => row.leadMagnet!);
}

// Get a single lead magnet by ID
export async function getLeadMagnetAction(leadMagnetId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const { magnet, widget, project } = await verifyLeadMagnetOwnership(
    leadMagnetId,
    session.user.id,
  );

  if (!magnet) {
    return null;
  }

  // If linked to a widget, verify ownership
  if (widget && !project) {
    throw new Error("Unauthorized: You don't own this lead magnet");
  }

  return magnet;
}

// Toggle lead magnet active status
export async function toggleLeadMagnetStatusAction(leadMagnetId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const { magnet, widget, project } = await verifyLeadMagnetOwnership(
    leadMagnetId,
    session.user.id,
  );

  if (!magnet) {
    throw new Error("Lead magnet not found");
  }

  // If linked to a widget, verify ownership
  if (widget && !project) {
    throw new Error("Unauthorized: You don't own this lead magnet");
  }

  await db
    .update(leadMagnets)
    .set({
      isActive: !magnet.isActive,
      updatedAt: new Date(),
    })
    .where(eq(leadMagnets.id, leadMagnetId));

  if (project) {
    revalidatePath(`/projects/${project.id}`);
    revalidatePath(`/projects/${project.id}/lead-magnets`);
  }
}
