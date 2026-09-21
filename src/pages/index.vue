<script setup lang="ts">
import { projects } from "@/content/projects";

const featuredProjects = projects.filter((project) => project.featured);
</script>

<template>
    <section class="hero">
        <p class="eyebrow">PORTFOLIO</p>
        <h1>MATHIAS HAREIDE</h1>
        <p>developing developing developing developing developing</p>
    </section>

    <section>
        <h2>Technologies (auto scrolling carousel)</h2>
        <div v-for="(e, i) in ['C', 'C#', 'JS', 'TS', 'REACT', 'VUE', 'UNITY GAME ENGINE', 'RAYLIB', 'FIGMA']" :key="i">
            <p>{{ e }}</p>
        </div>
    </section>

    <section class="home-section">
        <div class="section-heading">
            <h2>Projects</h2>
            <RouterLink to="/projects">View all</RouterLink>
        </div>

        <div class="project-list project-list--compact">
            <RouterLink v-for="project in featuredProjects" :key="project.slug" class="project-list__item" :to="`/projects/${project.slug}`">
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
