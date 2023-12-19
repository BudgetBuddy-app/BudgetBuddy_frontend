<template>
    <div class="flex flex-col min-h-screen">
        <header class="bg-primary items-center">
            <nav>
                <ul class="flex justify-between">
                   <li>
                       <NuxtLink to="/dashboard" class="btn"><Icon name="material-symbols:home" />dashboard</NuxtLink>
                   </li>
                   <li>
                       <NuxtLink to="/transactions">transactions</NuxtLink>
                   </li>
                   <li>
                       <NuxtLink to="/budgets">budgets</NuxtLink>
                   </li>
                   <li>
                       <NuxtLink to="/statistics">statistics</NuxtLink>
                   </li>
                   <li>
                       <NuxtLink to="/accounts">accounts</NuxtLink>
                   </li>
                   <li>
                       <NuxtLink to="/investments">investments</NuxtLink>
                   </li>
                </ul>
            </nav>
        </header>
        <div class="flex-grow">
            <slot class="bg-tertiary"/>
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
 
 const { apiBasePath } = useRuntimeConfig()
 
 //call API endpoints
 //const { data: products } = await useFetch(apiBasePath+'/')
 
 //throw custom error
 /*
 if (!products.value) {
    throw createError({ statusCode: 404, statusMessage: 'Product Not Found', fatal: true })
 }
 */
 </script>