<script setup lang="ts">
import { projects } from "@/content/projects";

const featuredProjects = projects.filter((project) => project.featured);
</script>

<template>
    <section class="hero">
        <p class="eyebrow">Developer</p>
        <h1>Developing</h1>
        <p>developing developing developing developing developing</p>
    </section>

    <section class="home-section">
        <div class="section-heading">
            <h2>Projects</h2>
            <RouterLink to="/projects">View all</RouterLink>
        </div>

        <div class="project-list project-list--compact">
            <RouterLink v-for="project in featuredProjects" :key="project.slug" class="project-list__item" :to="`/projects/${project.slug}`">
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
