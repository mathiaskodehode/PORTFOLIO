<script setup lang="ts">
import { useI18n } from "vue-i18n";
import ProjectCard from "@/components/ProjectCard.vue";

const { t } = useI18n();
</script>

<template>
    <section class="projects-index">
        <header class="page-header">
            <p class="eyebrow">{{ t("projects.index.eyebrow") }}</p>
            <h1>{{ t("projects.index.title") }}</h1>
            <p>{{ t("projects.index.intro") }}</p>
        </header>

        <ProjectCard />
    </section>
</template>
