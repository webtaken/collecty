"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ProjectSettingsFormProps {
    project: {
        id: string;
        name: string;
        domain: string | null;
        description: string | null;
    };
}

export function ProjectSettingsForm({ project }: ProjectSettingsFormProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: project.name,
        domain: project.domain || "",
        description: project.description || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // We can use the action updateProjectAction here if exposed, or fetch api
            // Using fetch for simplicity given previous patterns in headers
            const res = await fetch(`/api/projects/${project.id}/update`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to update");

            toast.success("Project updated successfully");
            router.refresh();
        } catch (error) {
            toast.error("Failed to update project");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="domain">Website URL</Label>
                <Input
                    id="domain"
                    name="domain"
                    placeholder="e.g. https://example.com"
                    value={formData.domain}
                    onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground">
                    The domain where you will install the widget.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                />
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Changes
                </Button>
            </div>
        </form>
    );
}
