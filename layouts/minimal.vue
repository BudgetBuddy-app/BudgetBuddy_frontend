<template>
    <div class="flex flex-col min-h-screen">
        <header class="bg-primary py-4 items-center">
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
            <slot class="bg-tertiary" />
        </div>
        <footer class="flex bg-secondary items-center">
            <div class="w-1/2">
                <NuxtLink to="/documentation" class="btn">documentation</NuxtLink>
            </div>
            <div class="w-1/2">
                <div>made by Diogo Ferreira</div>
                <div>
                <NuxtLink to="https://www.github.com/diogo-febra-ferreira/"> <Icon name="mdi:linkedin" color="blue"/>Github</NuxtLink>
            </div>
            <div>
                <NuxtLink to="https://www.linkedin.com/in/diogo-febra-ferreira/"> <Icon name="mdi:github" color="blue" />Linkedin</NuxtLink>
            </div>
            </div>
        </footer>
    </div>
</template>

<script setup>

</script>