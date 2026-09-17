---
title: Backend API
description: A C# API project focused on clean service boundaries and reliable data access.
year: 2024
category: backend
technologies: [C#, ASP.NET Core, REST API]
featured: true
---

## The problem

Describe the backend problem, the requirements, and the constraints that shaped the API design.

## API design

Explain the service boundaries, data flow, validation, error handling, and other implementation decisions that are worth documenting.

## What I learned

End with the practical lessons from building and maintaining the API.

## THIS IS ALL PLACEHOLDER

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
