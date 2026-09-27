<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { getProjects } from "@/content/projects";
import type { Locale } from "@/i18n";

const { t, locale } = useI18n();

const featuredProjects = computed(() => getProjects(locale.value as Locale).filter((project) => project.featured));
const logoPath = (name: string) => `${import.meta.env.BASE_URL}images/logos/${name}.webp`;
</script>

<template>
    <section class="hero homeSection">
        <p class="eyebrow">{{ t("home.eyebrow") }}</p>
        <h1>{{ t("home.title") }}</h1>
        <p>{{ t("home.tagline") }}</p>
        <h2>{{ t("home.aboutHeading") }}</h2>
        <p>{{ t("home.aboutBody") }}</p>
    </section>

    <section class="home-projects-section homeSection">
        <div class="section-heading">
            <h2>{{ t("home.projectsHeading") }}</h2>
            <RouterLink to="/projects">{{ t("home.viewAll") }}</RouterLink>
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
        <h2>{{ t("home.technologiesHeading") }}</h2>
        <div class="technologiesGrid">
            <div class="tecnologyItem" v-for="(e, i) in ['C', 'C Sharp', 'Javascript', 'Typescript', 'Git', 'Github', 'React', 'Vue.js', 'Unity', 'Raylib', 'Figma', 'Node.js', 'Bash', 'html', 'css']" :key="i">
                <h3>{{ e }}</h3>
                <img :src="logoPath(e)" :alt="`${e} logo`" class="technologyLogo" />
            </div>
        </div>
    </section>
</template>
