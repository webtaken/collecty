"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface Project {
    id: string;
    name: string;
    description: string | null;
    domain: string | null;
    isActive: boolean;
    subscriberCount: number;
    createdAt: Date;
}

export function ProjectCard({ project }: { project: Project }) {
    const router = useRouter();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const response = await fetch(`/api/projects/${project.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete project");
            }

            toast.success("Project deleted successfully");
            router.refresh();
            setShowDeleteModal(false);
        } catch (error) {
            toast.error("Failed to delete project");
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className="relative group h-full">
                <Link href={`/projects/${project.id}`} className="block h-full">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                        <CardHeader className="pb-3 pr-14">
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-lg pr-8">{project.name}</CardTitle>
                                <Badge variant={project.isActive ? "default" : "secondary"}>
                                    {project.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                            {project.domain && (
                                <CardDescription className="truncate">
                                    {project.domain}
                                </CardDescription>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-1.5 text-slate-600">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                    {project.subscriberCount} subscribers
                                </div>
                                <span className="text-slate-400">
                                    {new Date(project.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
                <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 w-8 h-8"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowDeleteModal(true);
                    }}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            project "{project.name}" and remove all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
