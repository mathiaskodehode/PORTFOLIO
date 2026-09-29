<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { Project } from "@/content/projects";

defineProps<{
    project: Project;
}>();

const { t } = useI18n();
</script>

<template>
    <article class="project-post">
        <header class="project-post__header">
            <p class="project-post__meta">{{ project.year }} · {{ project.category }}</p>
            <h1>{{ project.title }}</h1>
            <p class="project-post__intro">{{ project.description }}</p>
            <br />
            <div v-if="project.githubUrl || project.demoUrl" class="project-post__links">
                <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" rel="noreferrer">{{ t("projects.post.github") }}</a>
                <a v-if="project.demoUrl" :href="project.demoUrl" target="_blank" rel="noreferrer">{{ t("projects.post.liveSite") }}</a>
            </div>
        </header>

        <div class="project-post__body" v-html="project.html"></div>

        <footer class="project-post__footer">
            <div>
                <p class="project-post__label">{{ t("projects.post.builtWith") }}</p>
                <ul class="technology-list">
                    <li v-for="technology in project.technologies" :key="technology">
                        {{ technology }}
                    </li>
                </ul>
            </div>

            <div v-if="project.githubUrl || project.demoUrl" class="project-post__links">
                <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" rel="noreferrer">{{ t("projects.post.github") }}</a>
                <a v-if="project.demoUrl" :href="project.demoUrl" target="_blank" rel="noreferrer">{{ t("projects.post.liveSite") }}</a>
            </div>
        </footer>
    </article>
</template>
