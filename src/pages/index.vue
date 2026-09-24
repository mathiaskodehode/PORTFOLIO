<script setup lang="ts">
import { projects } from "@/content/projects";

const featuredProjects = projects.filter((project) => project.featured);
const logoPath = (name: string) => `${import.meta.env.BASE_URL}images/logos/${name}.webp`;
</script>

<template>
    <section class="hero homeSection">
        <p class="eyebrow">PORTFOLIO</p>
        <h1>Mathias Hareide</h1>
        <p>developing developing developing developing developing</p>
        <h2>About me</h2>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi iusto consequatur illum placeat nisi reprehenderit dignissimos et saepe ab impedit tenetur deleniti repudiandae sed veritatis eligendi natus, doloribus
            esse eaque, perspiciatis, debitis sit quibusdam maiores corrupti soluta? Facilis numquam adipisci atque, aut a minima distinctio doloribus, nihil ab odio explicabo aspernatur tenetur nisi voluptates id asperiores
            architecto eius alias nam! Delectus, iure fuga ratione deserunt necessitatibus recusandae maiores dignissimos!
        </p>
    </section>

    <section class="home-projects-section homeSection">
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

    <section class="technologiesSection homeSection">
        <h2>Technologies</h2>
        <div class="technologiesGrid">
            <div class="tecnologyItem" v-for="(e, i) in ['C', 'C Sharp', 'Javascript', 'Typescript', 'Git', 'Github', 'React', 'Vue.js', 'Unity', 'Raylib', 'Figma', 'Node.js', 'Bash', 'html', 'css']" :key="i">
                <h3>{{ e }}</h3>
                <img :src="logoPath(e)" :alt="`${e} logo`" class="technologyLogo" />
            </div>
        </div>
    </section>
</template>
