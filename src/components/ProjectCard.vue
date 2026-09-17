<script setup lang="ts">
import type { Project } from "@/content/projects";

defineProps<{
    project: Project;
}>();
</script>

<template>
    <article class="project-card">
        <div class="project-card__body">
            <div class="project-card__meta">
                <span class="project-card__category">{{ project.category }}</span>
                <span v-if="project.featured" class="project-card__featured">Featured</span>
            </div>

            <h2>{{ project.title }}</h2>
            <p>{{ project.description }}</p>

            <div class="project-card__tags">
                <span v-for="technology in project.technologies" :key="technology">
                    {{ technology }}
                </span>
            </div>
        </div>

        <RouterLink class="project-card__link" :to="`/projects/${project.slug}`"> View project <span aria-hidden="true"></span> </RouterLink>
    </article>
</template>
