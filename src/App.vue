<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { setLocale, SUPPORTED_LOCALES, type Locale } from "@/i18n";

const { t, locale } = useI18n();
</script>

<template>
    <div class="app-shell">
        <header class="site-header">
            <nav aria-label="Main navigation">
                <RouterLink to="/">{{ t("nav.home") }}</RouterLink>
                <RouterLink to="/projects">{{ t("nav.projects") }}</RouterLink>
                <RouterLink to="/cv">{{ t("nav.cv") }}</RouterLink>
            </nav>

            <div class="locale-switcher" role="group" aria-label="Language">
                <button
                    v-for="code in SUPPORTED_LOCALES"
                    :key="code"
                    type="button"
                    class="locale-switcher__button"
                    :class="{ 'locale-switcher__button--active': locale === code }"
                    :aria-pressed="locale === code"
                    @click="setLocale(code as Locale)"
                >
                    {{ code.toUpperCase() }}
                </button>
            </div>
        </header>

        <main>
            <RouterView />
        </main>
    </div>
</template>
