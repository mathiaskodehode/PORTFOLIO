---
title: Personal Portfolio (PLACEHOLDER WRITTEN BY AI)
description: A personal portfolio built with Vue, TypeScript, and Vite to showcase my projects and explore modern frontend development.
year: 2026
category: frontend
technologies: [Vue, TypeScript, Vite]
featured: true
---

# Building My Personal Portfolio with Vue

## Introduction

I built this portfolio to bring my projects, the technologies I work with, and a bit about myself together in one place. It's built with Vue 3, TypeScript, and Vite, and it's designed to be hosted as a static website using GitHub Pages.

Besides showcasing my work, this project gave me a chance to get hands-on experience with Vue's component system, routing, localization, Markdown processing, and automated deployment.

## Technology Stack

Here's a quick look at the tools and libraries I used to build the portfolio:

- **Vue 3** for building the user interface with reusable components.
- **TypeScript** for keeping the code and data structures type-safe.
- **Vite** for local development and production builds.
- **Vue Router** for handling navigation between pages.
- **Vue I18n** for supporting both English and Norwegian.
- **Markdown-it and Shiki** for rendering project articles and highlighting code snippets.
- **Vitest and Playwright** for browser-based testing.
- **Oxlint and Oxfmt** for linting and formatting the code.
- **GitHub Actions and GitHub Pages** for automating the deployment process.

## Application Structure

I split the application into pages, reusable components, and content modules to keep things organized. The main app layout handles the navigation and language selector, while the router takes care of displaying the right page based on the current URL.

The app is initialized in `src/main.ts`:

```ts
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

if (import.meta.hot) handleHotUpdate(router);

createApp(App).use(DataLoaderPlugin, { router }).use(router).use(i18n).mount("#app");
```

The router uses the configured base URL, which is important because GitHub Pages hosts the site under a repository subpath. I also register Vue I18n here so components can access translated text throughout the app.

## Pages and Navigation

The portfolio has a home page, a project overview, individual project pages, and a CV page. Vue Router handles navigation between them.

The project overview displays each project as a link. Each link uses the project's slug to build its URL:

```vue
<RouterLink v-for="project in projects" :key="project.slug" class="project-list__item" :to="`/projects/${project.slug}`">
    <div class="project-list__year">{{ project.year }}</div>
    <div class="project-list__main">
        <strong>{{ project.title }}</strong>
        <div>{{ project.description }}</div>
        <small>{{ project.technologies.join(" · ") }}</small>
    </div>
</RouterLink>
```

This makes the project list data-driven. When I add a new project to the content source, it automatically shows up in the overview without me having to create another card manually.

## Reusable Components

I use reusable components to avoid repeating the same presentation logic throughout the app.

For example, `ProjectCard.vue` receives a project object through a typed prop:

```vue
<script setup lang="ts">
import type { Project } from "@/content/projects";

defineProps<{
    project: Project;
}>();
</script>
```

The component can then display the project's title, description, category, technologies, and link. Using a shared project type also helps keep the data consistent across the application.

## Managing Project Content

I use a TypeScript interface to define the structure of each project:

```ts
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
```

The actual project articles are written in Markdown files, with separate files for each language. This keeps the written content separate from the Vue components and makes longer articles easier to edit and maintain.

Vite finds these files using `import.meta.glob`:

```ts
const files = import.meta.glob("./projects/*/*.md", {
    eager: true,
    import: "default",
}) as Record<string, RawProject>;
```

The content module extracts the language and slug from each file path, then groups the projects by language. If a translated version isn't available, the English version is used as a fallback.

The projects are sorted by year, with the newest ones first:

```ts
export function getProjects(locale: Locale = DEFAULT_LOCALE): Project[] {
    const fallback = projectsFor(DEFAULT_LOCALE);
    const localized = projectsFor(locale);

    return Array.from(fallback.keys())
        .map((slug) => localized.get(slug) ?? fallback.get(slug)!)
        .toSorted((a, b) => b.year - a.year);
}
```

This keeps all the project content in one place while letting the app display the right language based on the user's current settings.

## Rendering Markdown and Code Snippets

I use Markdown for project articles because it makes it easy to write headings, paragraphs, lists, links, images, and code snippets without having to build a separate Vue component for every article.

A custom Vite plugin handles the Markdown files during the build. It uses `gray-matter` to read the front matter, `markdown-it` to convert the content into HTML, and Shiki to highlight code snippets:

```ts
const md = new MarkdownIt({ linkify: true, html: true });

md.use(await shiki({ theme: "dark-plus" }));
```

The plugin turns each Markdown file into a JavaScript module containing the article's metadata and rendered HTML:

```ts
const { data, content } = matter(raw);

const html = resolveMarkdownImages(wrapIntoSections(md.render(content)));

return `export default ${JSON.stringify({ ...data, html })};`;
```

This means the articles are processed during the build instead of being manually added to the page components. Shiki also makes code snippets easier to read by adding syntax highlighting.

The rendered article is displayed in the project post component:

```vue
<div class="project-post__body" v-html="project.html"></div>
```

Since `v-html` inserts HTML directly into the page, I keep the content limited to trusted Markdown files rather than allowing untrusted user input.

## Localization

The portfolio supports both English and Norwegian using Vue I18n. The interface translations are stored in separate locale files, while the project articles are organized into language-specific directories.

When the app starts, it checks for a saved language preference first, then looks at the browser's language, and finally falls back to English:

```ts
function detectInitialLocale(): Locale {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isSupportedLocale(stored)) return stored;

    const browserLanguage = navigator.language?.slice(0, 2);
    if (isSupportedLocale(browserLanguage)) return browserLanguage;

    return "en";
}
```

When someone switches languages, the app updates the active locale, saves the choice, and updates the document's language attribute:

```ts
export function setLocale(locale: Locale): void {
    i18n.global.locale.value = locale;
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
}
```

Keeping the interface translations separate from the project articles makes it easier to translate navigation and labels independently from the longer content.

## Deployment with GitHub Actions

I use GitHub Actions to deploy the portfolio to GitHub Pages. Whenever I push changes to the `main` branch, the workflow installs the dependencies, builds the site, uploads the generated `dist` directory, and deploys it.

Since a repository-based GitHub Pages site is hosted under a subpath, I pass a base path to the build:

```yaml
- run: npm run build
  env:
      VITE_BASE_PATH: /${{ github.event.repository.name }}/
```

Vite uses this value as the app's base URL, making sure assets and routes work correctly on GitHub Pages. The workflow then uploads the build output and deploys it using the GitHub Pages actions.

I also copy `index.html` to `404.html` after the build. This provides a fallback for static hosting when someone opens a route directly instead of navigating to it through the app.

## Quality Checks and Testing

I use a few tools to catch issues before deploying the site:

- Type checking runs as part of the production build.
- Oxlint handles linting.
- Oxfmt keeps the code formatting consistent.
- Vitest runs browser tests through Playwright.

The browser tests are configured to run in Chromium, Firefox, and WebKit in headless mode. This lets me test the app in different browser engines without opening visible browser windows.

## What I Learned

Building this portfolio brought together a lot of different parts of frontend development. I got to work with reusable Vue components, typed content data, routing, localization, and a custom Markdown processing pipeline.

One of the main things I focused on was keeping the project content separate from the components that display it. Writing articles in Markdown makes them easier to maintain, while the content module handles finding the files, selecting the right language, and sorting the projects. The custom Vite plugin ties everything together by converting the Markdown files into modules during the build.

I also got a better understanding of how static site deployment works, especially when the site is hosted under a repository subpath instead of directly at the root of a domain.

## Conclusion

This portfolio is more than just a place to showcase my projects. It's also a hands-on project where I got to bring together Vue, TypeScript, routing, localization, Markdown rendering, automated testing, and deployment.

The setup makes it easy to add new projects and keep the site organized as it grows.
