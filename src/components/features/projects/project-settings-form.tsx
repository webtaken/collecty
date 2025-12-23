"use client";

import { useActionState } from "react";
import { updateProjectAction } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Project = {
  id: string;
  name: string;
  domain: string | null;
  description: string | null;
};

type ProjectSettingsFormProps = {
  project: Project;
};

export function ProjectSettingsForm({ project }: ProjectSettingsFormProps) {
  const [error, formAction, isPending] = useActionState(
    async (_prevState: string | null, formData: FormData) => {
      try {
        await updateProjectAction(project.id, formData);
        return null;
      } catch (e) {
        return e instanceof Error ? e.message : "Something went wrong";
      }
    },
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={project.name}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="domain">Website URL</Label>
        <Input
          id="domain"
          name="domain"
          type="url"
          defaultValue={project.domain || ""}
          placeholder="https://example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={project.description || ""}
          rows={3}
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}

