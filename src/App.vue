<template>
    <div class="app-shell">
        <header class="site-header">
            <nav aria-label="Main navigation">
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/projects">Projects</RouterLink>
                <RouterLink to="/about">About</RouterLink>
            </nav>
        </header>

        <main>
            <RouterView />
        </main>
    </div>
</template>
