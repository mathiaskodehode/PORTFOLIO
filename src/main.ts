import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { DataLoaderPlugin } from "vue-router/experimental";
import { routes, handleHotUpdate } from "vue-router/auto-routes";
import App from "./App.vue";
import "./style.css";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

if (import.meta.hot) handleHotUpdate(router);

createApp(App).use(DataLoaderPlugin, { router }).use(router).mount("#app");
