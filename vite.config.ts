import { fileURLToPath, URL } from "node:url";
import { defineConfig, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import VueRouter from "vue-router/vite";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import shiki from "@shikijs/markdown-it";

const base = process.env.VITE_BASE_PATH || "/";

function wrapIntoSections(html: string): string {
    return html
        .split(/(?=<h2)/)
        .filter(Boolean)
        .map((s) => `<section>${s}</section>`)
        .join("");
}

export default defineConfig(async () => {
    const md = new MarkdownIt({ linkify: true, html: true });
    md.use(await shiki({ theme: "dark-plus" }));

    function resolveMarkdownImages(html: string): string {
        return html.replace(/(<img\b[^>]*\bsrc=")\/([^"]*)(")/g, `$1${base}$2$3`);
    }

    function projectMarkdown(): Plugin {
        return {
            name: "project-markdown",
            transform(raw, id) {
                if (!id.includes("/content/projects/") || !id.endsWith(".md")) return;

                const { data, content } = matter(raw);
                const html = resolveMarkdownImages(wrapIntoSections(md.render(content)));

                return `export default ${JSON.stringify({ ...data, html })};`;
            },
        };
    }

    return {
        base,
        plugins: [projectMarkdown(), VueRouter(), vue(), vueDevTools()],
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            },
        },
    };
});
