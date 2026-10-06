<script setup lang="ts">
import { useI18n } from "vue-i18n";
import ProjectCard from "@/components/ProjectCards.vue";

const { t } = useI18n();

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

        <ProjectCard />
    </section>

    <section class="technologiesSection homeSection">
        <h2>{{ t("home.technologiesHeading") }}</h2>
        <div class="technologiesGrid">
            <div class="technologiesItem" v-for="(e, i) in ['C', 'C Sharp', 'Javascript', 'Typescript', 'Git', 'Github', 'React', 'Vue.js', 'Unity', 'Raylib', 'Figma', 'Node.js', 'Bash', 'html', 'css', 'sql', 'matlab']" :key="i">
                <h3>{{ e }}</h3>
                <img :src="logoPath(e)" :alt="`${e} logo`" class="technologyLogo" />
            </div>
        </div>
    </section>
</template>
