import { fileURLToPath, URL } from "node:url";
import { defineConfig, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import VueRouter from "vue-router/vite";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";

const base = process.env.VITE_BASE_PATH || "/";
const md = new MarkdownIt({ linkify: true });

function wrapIntoSections(html: string): string {
    return html
        .split(/(?=<h2)/)
        .filter(Boolean)
        .map((section) => `<section>${section}</section>`)
        .join("");
}

function projectMarkdown(): Plugin {
    return {
        name: "project-markdown",
        transform(raw, id) {
            if (!id.includes("/content/projects/") || !id.endsWith(".md")) return;

            const { data, content } = matter(raw);
            const html = wrapIntoSections(md.render(content));

            return `export default ${JSON.stringify({ ...data, html })};`;
        },
    };
}

export default defineConfig({
    base,
    plugins: [projectMarkdown(), VueRouter(), vue(), vueDevTools()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
});
