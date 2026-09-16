<script setup lang="ts">
import type { Project } from "@/content/projects";

defineProps<{
    project: Project;
}>();
</script>

<template>
    <article class="project-post">
        <RouterLink class="back-link" to="/projects">Projects</RouterLink>

        <header class="project-post__header">
            <p class="project-post__meta">{{ project.year }} · {{ project.category }}</p>
            <h1>{{ project.title }}</h1>
            <p class="project-post__intro">{{ project.description }}</p>
        </header>

        <div class="project-post__body" v-html="project.html"></div>

        <footer class="project-post__footer">
            <div>
                <p class="project-post__label">Built with</p>
                <ul class="technology-list">
                    <li v-for="technology in project.technologies" :key="technology">
                        {{ technology }}
                    </li>
                </ul>
            </div>

            <div v-if="project.githubUrl || project.demoUrl" class="project-post__links">
                <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" rel="noreferrer">GitHub</a>
                <a v-if="project.demoUrl" :href="project.demoUrl" target="_blank" rel="noreferrer">Live site</a>
            </div>
        </footer>
    </article>
</template>
