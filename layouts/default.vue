<template>
    <div class="flex flex-col min-h-screen">
        <header class="bg-primary py-3 sticky top-0">
            <nav class="px-10 flex">
                <ul class="flex justify-between items-center w-10/12">
                    <li>
                        <NuxtLink to="/dashboard" class="btn">
                            <Icon name="material-symbols:home" /> dashboard
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/transactions">
                            <Icon name="grommet-icons:transaction" /> transactions
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/budgets">
                            <Icon name="carbon:money" /> budgets
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/statistics">
                            <Icon name="solar:chart-bold" /> statistics
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/accounts">
                            <Icon name="bytesize:creditcard" /> accounts
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/investments">
                            <Icon name="charm:chart-line" /> investments
                        </NuxtLink>
                    </li>
                </ul>
                <ul class="flex justify-end items-center right-0 w-2/12">
                    <li class="mr-5">
                        <NuxtLink to="/user">
                            <Icon name="ph:user" size="30" />
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/settings">

                        <Icon name="ic:baseline-settings" size="30"/>
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
                    <NuxtLink to="https://www.github.com/diogo-febra-ferreira/">
                        <Icon name="mdi:linkedin" color="blue" />Github
                    </NuxtLink>
                </div>
                <div>
                    <NuxtLink to="https://www.linkedin.com/in/diogo-febra-ferreira/">
                        <Icon name="mdi:github" color="blue" />Linkedin
                    </NuxtLink>
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