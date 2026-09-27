<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
    <section class="page-header">
        <p class="eyebrow">{{ t("cv.eyebrow") }}</p>
        <h1>{{ t("cv.title") }}</h1>
        <p>{{ t("cv.body") }}</p>
    </section>
</template>
