import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { projects } from "@/db/schema/projects";
import { eq, and } from "drizzle-orm";

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, domain, description } = await request.json();
        const projectId = params.id;

        // Update the project
        const [updatedProject] = await db
            .update(projects)
            .set({
                ...(name !== undefined && { name }),
                ...(domain !== undefined && { domain }),
                ...(description !== undefined && { description }),
            })
            .where(
                and(
                    eq(projects.id, projectId),
                    eq(projects.userId, session.user.id)
                )
            )
            .returning();

        if (!updatedProject) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json(updatedProject);
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json(
            { error: "Failed to update project" },
            { status: 500 }
        );
    }
}
