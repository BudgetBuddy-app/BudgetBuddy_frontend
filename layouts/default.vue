<template>
    <div>
        <header class="bg-green-200">
            <nav>
                <ul>
                    <li>
                        <NuxtLink to="/transactions" class="btn">transactions</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/dashboard">dashboard</NuxtLink>
                    </li>
                    <li>
                        <ComponentTest />
                    </li>
                </ul>
            </nav>
        </header>
        <div>
            <slot />
        </div>
        <footer class="shadow-sm bg-blue-500">
            qwerty
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