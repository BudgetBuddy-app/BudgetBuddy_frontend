<template>
    <div class="flex flex-col min-h-screen">
        <header class="bg-primary py-3 sticky top-0">
            <nav>
                <ul class="flex justify-center">
                    <li>
                        <NuxtLink to="/dashboard" class="btn">
                            <Icon name="material-symbols:home" />dashboard
                        </NuxtLink>
                    </li>
                </ul>
            </nav>
        </header>
        <div class="flex-grow">
            <slot />
        </div>
        <footer class="flex justify-between bg-secondary items-center px-10">
            <div>
                <div>made by Diogo Ferreira</div>
                <div>
                <NuxtLink to="https://www.github.com/diogo-febra-ferreira/"> <Icon name="mdi:linkedin" color="blue"/>Github</NuxtLink>
            </div>
            <div>
                <NuxtLink to="https://www.linkedin.com/in/diogo-febra-ferreira/"> <Icon name="mdi:github" color="blue" />Linkedin</NuxtLink>
            </div>
            </div>
            <div>
                <NuxtLink to="/documentation" class="btn">
                    <Icon name="basil:document-outline" />documentation
                </NuxtLink>
            </div>
        </footer>
    </div>
</template>

<script setup>

</script>

<style scoped>
.router-link-exact-active {
    @apply btn;
}
</style>