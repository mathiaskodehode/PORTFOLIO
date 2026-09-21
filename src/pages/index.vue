<script setup lang="ts">
import { projects } from "@/content/projects";

const featuredProjects = projects.filter((project) => project.featured);
const logoPath = (name: string) => `${import.meta.env.BASE_URL}images/logos/${name}.webp`;
</script>

<template>
    <section class="hero">
        <p class="eyebrow">PORTFOLIO</p>
        <h1>Mathias Hareide</h1>
        <p>developing developing developing developing developing</p>
    </section>

    <section>
        <h2>Technologies</h2>
        <div class="technologiesSection">
            <div class="tecnologyItem" v-for="(e, i) in ['C', 'C Sharp', 'Javascript', 'Typescript', 'Git', 'Github', 'React', 'Vue.js', 'Unity', 'Raylib', 'Figma', 'Node.js']" :key="i">
                <h3>{{ e }}</h3>
                <img :src="logoPath(e)" :alt="`${e} logo`" class="technologyLogo" />
            </div>
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
