<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { Project } from "@/content/projects";

defineProps<{
    project: Project;
}>();

const { t } = useI18n();
</script>

<template>
    <article class="project-card">
        <div class="project-card__body">
            <div class="project-card__meta">
                <div class="project-card__category">{{ project.category }}</div>
                <div v-if="project.featured" class="project-card__featured">
                    {{ t("projects.card.featured") }}
                </div>
            </div>
            <h2>{{ project.title }}</h2>
            <p>{{ project.description }}</p>
            <div class="project-card__tags">
                <div v-for="technology in project.technologies" :key="technology">
                    {{ technology }}
                </div>
            </div>
        </div>

        <RouterLink class="project-card__link" :to="`/projects/${project.slug}`">
            {{ t("projects.card.viewProject") }}
            <div aria-hidden="true"></div>
        </RouterLink>
    </article>
</template>
