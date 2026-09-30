<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { getProjects } from "@/content/projects";
import type { Locale } from "@/i18n";

const { locale } = useI18n();

const featuredProjects = computed(() => getProjects(locale.value as Locale).filter((project) => project.featured));

function getThumbnailImagePath(path: string) {
    return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
</script>

<template>
    <div class="project-list project-list--compact">
        <RouterLink v-for="project in featuredProjects" :key="project.slug" class="project-list__item" :to="`/projects/${project.slug}`">
            <div class="project-list__year">{{ project.year }}</div>
            <img :src="getThumbnailImagePath(project.thumbnailImagePath!)" class="project-list__thumbnail" />
            <div class="project-list__main">
                <strong>{{ project.title }}</strong>
                <div>{{ project.description }}</div>
                <small>{{ project.technologies.join(" · ") }}</small>
            </div>
            <div class="project-list__arrow" aria-hidden="true"></div>
        </RouterLink>
    </div>
</template>
