<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import ProjectPost from "@/components/projects/ProjectPost.vue";
import { getProjectBySlug } from "@/content/projects";
import type { Locale } from "@/i18n";

const route = useRoute();
const { t, locale } = useI18n();
const project = computed(() => getProjectBySlug(route.params.slug as string, locale.value as Locale));
</script>

<template>
    <ProjectPost v-if="project" :project="project" />
    <section v-else class="empty-state">
        <p class="eyebrow">{{ t("projects.notFound.eyebrow") }}</p>
        <h1>{{ t("projects.notFound.title") }}</h1>
        <RouterLink to="/projects">{{ t("projects.notFound.back") }}</RouterLink>
    </section>
</template>
