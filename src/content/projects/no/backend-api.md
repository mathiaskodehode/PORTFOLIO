---
title: Backend-API
description: Et C#-API-prosjekt med fokus på rene tjenestegrenser og pålitelig datatilgang.
year: 2024
category: backend
technologies: [C#, ASP.NET Core, REST API]
featured: true
---

## Problemet

Beskriv backend-problemet, kravene, og begrensningene som formet API-designet.

## API-design

Forklar tjenestegrensene, dataflyten, validering, feilhåndtering, og andre implementasjonsbeslutninger som er verdt å dokumentere.

## Hva jeg lærte

Avslutt med de praktiske lærdommene fra å bygge og vedlikeholde API-et.

## DETTE ER PLACEHOLDER

PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER PLACEHOLDER

<img src="/images/gambling.png" width="600"/>

```ts
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { DataLoaderPlugin } from "vue-router/experimental";
import { routes, handleHotUpdate } from "vue-router/auto-routes";
import App from "./App.vue";
// oxlint-disable-next-line import/no-unassigned-import
import "./style.css";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

if (import.meta.hot) handleHotUpdate(router);
createApp(App).use(DataLoaderPlugin, { router }).use(router).mount("#app");
```
