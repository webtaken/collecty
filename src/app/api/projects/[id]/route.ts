import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { projects } from "@/db/schema/projects";
import { eq, and } from "drizzle-orm";

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const projectId = params.id;

        // Delete the project
        const [deletedProject] = await db
            .delete(projects)
            .where(
                and(
                    eq(projects.id, projectId),
                    eq(projects.userId, session.user.id)
                )
            )
            .returning();

        if (!deletedProject) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json(deletedProject);
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json(
            { error: "Failed to delete project" },
            { status: 500 }
        );
    }
}
