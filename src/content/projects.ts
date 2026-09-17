export type ProjectCategory = "frontend" | "backend" | "fullstack";

// asked ai to give me a bunch of things. mostly placeholder
export interface Project {
    slug: string;
    title: string;
    description: string;
    year: number;
    category: ProjectCategory;
    technologies: string[];
    featured?: boolean;
    githubUrl?: string;
    demoUrl?: string;
    html: string;
}

const files = import.meta.glob("./projects/*.md", {
    eager: true,
    import: "default",
}) as Record<string, Omit<Project, "slug">>;

function slugFromPath(path: string): string {
    return path.split("/").pop()!.replace(/\.md$/, "");
}

export const projects: Project[] = Object.entries(files)
    .map(([path, data]) => Object.assign({ slug: slugFromPath(path) }, data))
    .toSorted((a, b) => b.year - a.year);

export function getProjectBySlug(slug: string) {
    return projects.find((project) => project.slug === slug);
}
