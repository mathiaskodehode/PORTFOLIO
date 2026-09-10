<script setup lang="ts"></script>

<template>
    <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
    <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
    </nav>
    <main>
        <RouterView />
    </main>
</template>

<style scoped src="./styles/app.css" />
