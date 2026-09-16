<script setup lang="ts">
import { projects } from "@/content/projects";
</script>

<template>
    <section class="projects-index">
        <header class="page-header">
            <p class="eyebrow">Selected work</p>
            <h1>Projects</h1>
            <p>A collection of things I've built.</p>
        </header>

        <div class="project-list">
            <RouterLink
                v-for="project in projects"
                :key="project.slug"
                class="project-list__item"
                :to="`/projects/${project.slug}`"
            >
                <span class="project-list__year">{{ project.year }}</span>
                <span class="project-list__main">
                    <strong>{{ project.title }}</strong>
                    <span>{{ project.description }}</span>
                    <small>{{ project.technologies.join(" · ") }}</small>
                </span>
                <span class="project-list__arrow" aria-hidden="true"></span>
            </RouterLink>
        </div>
    </section>
</template>
