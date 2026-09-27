<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { getProjects } from "@/content/projects";
import type { Locale } from "@/i18n";

const { t, locale } = useI18n();
const projects = computed(() => getProjects(locale.value as Locale));
</script>

<template>
    <section class="projects-index">
        <header class="page-header">
            <p class="eyebrow">{{ t("projects.index.eyebrow") }}</p>
            <h1>{{ t("projects.index.title") }}</h1>
            <p>{{ t("projects.index.intro") }}</p>
        </header>

        <div class="project-list">
            <RouterLink v-for="project in projects" :key="project.slug" class="project-list__item" :to="`/projects/${project.slug}`">
                <div class="project-list__year">{{ project.year }}</div>
                <div class="project-list__main">
                    <strong>{{ project.title }}</strong>
                    <div>{{ project.description }}</div>
                    <small>{{ project.technologies.join(" · ") }}</small>
                </div>
                <div class="project-list__arrow" aria-hidden="true"></div>
            </RouterLink>
        </div>
    </section>
</template>
