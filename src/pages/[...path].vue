<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
    <section class="empty-state">
        <p class="eyebrow">{{ t("notFound.eyebrow") }}</p>
        <h1>{{ t("notFound.title") }}</h1>
        <p>{{ t("notFound.body") }}</p>
        <RouterLink to="/">{{ t("notFound.back") }}</RouterLink>
    </section>
</template>
