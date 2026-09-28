import type { Locale } from "@/i18n";

export type ProjectCategory = "frontend" | "backend" | "fullstack";

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

type RawProject = Omit<Project, "slug">;

const files = import.meta.glob("./projects/*/*.md", {
    eager: true,
    import: "default",
}) as Record<string, RawProject>;

function parsePath(path: string): { locale: string; slug: string } {
    const parts = path.split("/");
    const slug = parts.pop()!.replace(/\.md$/, "");
    const locale = parts.pop()!;
    return { locale, slug };
}

const DEFAULT_LOCALE: Locale = "en";

const byLocale = new Map<string, Map<string, Project>>();
for (const [path, data] of Object.entries(files)) {
    const { locale, slug } = parsePath(path);
    if (!byLocale.has(locale)) byLocale.set(locale, new Map());
    byLocale.get(locale)!.set(slug, { slug, ...data });
}

function projectsFor(locale: Locale): Map<string, Project> {
    return byLocale.get(locale) ?? new Map();
}

export function getProjects(locale: Locale = DEFAULT_LOCALE): Project[] {
    const fallback = projectsFor(DEFAULT_LOCALE);
    const localized = projectsFor(locale);

    return Array.from(fallback.keys())
        .map((slug) => localized.get(slug) ?? fallback.get(slug)!)
        .toSorted((a, b) => b.year - a.year);
}

export function getProjectBySlug(slug: string, locale: Locale = DEFAULT_LOCALE): Project | undefined {
    return projectsFor(locale).get(slug) ?? projectsFor(DEFAULT_LOCALE).get(slug);
}
