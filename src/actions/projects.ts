"use server";

import { auth } from "@/lib/auth";
import { db, projects, subscribers, apiKeys } from "@/db";
import { eq, and, desc, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createProjectSchema,
  updateProjectSchema,
} from "@/lib/validations/project";
import {
  defaultWidgetConfig,
  defaultInlineWidgetConfig,
  type WidgetConfig,
  type InlineWidgetConfig,
} from "@/db/schema/projects";
import { nanoid } from "nanoid";
import { createHash } from "crypto";

export async function createProjectAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const rawData = {
    name: formData.get("name") as string,
    domain: formData.get("domain") as string,
    description: formData.get("description") as string,
  };

  const validated = createProjectSchema.parse(rawData);

  const [project] = await db
    .insert(projects)
    .values({
      userId: session.user.id,
      name: validated.name,
      domain: validated.domain || null,
      description: validated.description || null,
      widgetConfig: defaultWidgetConfig,
      inlineWidgetConfig: defaultInlineWidgetConfig,
    })
    .returning();
  revalidatePath("/projects");
  revalidatePath("/dashboard");
  redirect(`/projects/${project.id}`);
}

export async function createProjectInlineAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const rawData = {
    name: formData.get("name") as string,
    domain: formData.get("domain") as string,
    description: formData.get("description") as string,
  };

  const validated = createProjectSchema.parse(rawData);

  const [project] = await db
    .insert(projects)
    .values({
      userId: session.user.id,
      name: validated.name,
      domain: validated.domain || null,
      description: validated.description || null,
      widgetConfig: defaultWidgetConfig,
      inlineWidgetConfig: defaultInlineWidgetConfig,
    })
    .returning();

  revalidatePath("/projects");
  revalidatePath("/dashboard");
  return { projectId: project.id };
}

export async function updateProjectAction(
  projectId: string,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const rawData = {
    name: formData.get("name") as string,
    domain: formData.get("domain") as string,
    description: formData.get("description") as string,
  };

  const validated = updateProjectSchema.parse(rawData);

  await db
    .update(projects)
    .set({
      ...validated,
      domain: validated.domain || null,
      updatedAt: new Date(),
    })
    .where(
      and(eq(projects.id, projectId), eq(projects.userId, session.user.id))
    );

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");
}

export async function updateWidgetConfigAction(
  projectId: string,
  config: WidgetConfig
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await db
    .update(projects)
    .set({
      widgetConfig: config,
      updatedAt: new Date(),
    })
    .where(
      and(eq(projects.id, projectId), eq(projects.userId, session.user.id))
    );

  revalidatePath(`/projects/${projectId}`);
}

export async function updateInlineWidgetConfigAction(
  projectId: string,
  config: InlineWidgetConfig
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await db
    .update(projects)
    .set({
      inlineWidgetConfig: config,
      updatedAt: new Date(),
    })
    .where(
      and(eq(projects.id, projectId), eq(projects.userId, session.user.id))
    );

  revalidatePath(`/projects/${projectId}`);
}

export async function toggleProjectStatusAction(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const [project] = await db
    .select()
    .from(projects)
    .where(
      and(eq(projects.id, projectId), eq(projects.userId, session.user.id))
    );

  if (!project) {
    throw new Error("Project not found");
  }

  await db
    .update(projects)
    .set({
      isActive: !project.isActive,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, projectId));

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");
  revalidatePath("/dashboard");
}

export async function deleteProjectAction(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await db
    .delete(projects)
    .where(
      and(eq(projects.id, projectId), eq(projects.userId, session.user.id))
    );

  revalidatePath("/projects");
  revalidatePath("/dashboard");
  redirect("/projects");
}

export async function generateApiKeyAction(projectId: string, name: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify project ownership
  const [project] = await db
    .select()
    .from(projects)
    .where(
      and(eq(projects.id, projectId), eq(projects.userId, session.user.id))
    );

  if (!project) {
    throw new Error("Project not found");
  }

  // Generate a new API key
  const rawKey = `clty_${nanoid(32)}`;
  const keyHash = createHash("sha256").update(rawKey).digest("hex");
  const keyPrefix = rawKey.slice(0, 12);

  await db.insert(apiKeys).values({
    projectId,
    keyHash,
    keyPrefix,
    name,
  });

  revalidatePath(`/projects/${projectId}`);

  // Return the raw key (only shown once)
  return rawKey;
}

export async function deleteApiKeyAction(keyId: string, projectId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify project ownership
  const [project] = await db
    .select()
    .from(projects)
    .where(
      and(eq(projects.id, projectId), eq(projects.userId, session.user.id))
    );

  if (!project) {
    throw new Error("Project not found");
  }

  await db.delete(apiKeys).where(eq(apiKeys.id, keyId));

  revalidatePath(`/projects/${projectId}`);
}

export async function getProjectWithStats(projectId: string, userId: string) {
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)));

  if (!project) {
    return null;
  }

  const [subscriberCount] = await db
    .select({ count: count() })
    .from(subscribers)
    .where(eq(subscribers.projectId, projectId));

  const recentSubscribers = await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.projectId, projectId))
    .orderBy(desc(subscribers.subscribedAt))
    .limit(10);

  const projectApiKeys = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.projectId, projectId))
    .orderBy(desc(apiKeys.createdAt));

  return {
    ...project,
    subscriberCount: subscriberCount?.count || 0,
    recentSubscribers,
    apiKeys: projectApiKeys,
  };
}
