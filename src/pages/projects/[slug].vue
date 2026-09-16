<script setup lang="ts">
import { useRoute } from "vue-router";
import ProjectPost from "@/components/projects/ProjectPost.vue";
import { getProjectBySlug } from "@/content/projects";

const route = useRoute();
const project = getProjectBySlug(route.params.slug as string);
</script>

<template>
    <ProjectPost v-if="project" :project="project" />
    <section v-else class="empty-state">
        <p class="eyebrow">404</p>
        <h1>Project not found</h1>
        <RouterLink to="/projects">Back to projects</RouterLink>
    </section>
</template>
