<template>
    <div class="flex flex-col min-h-screen">
        <header class="bg-primary py-3 sticky top-0 z-50">
            <nav class="px-10 flex">
                <ul class="flex justify-between items-center w-10/12">
                    <li>
                        <NuxtLink to="/categories">
                            <Icon name="material-symbols:folder-outline" /> <span class="hidden lg:inline">categories</span>
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/transactions">
                            <Icon name="grommet-icons:transaction" /> <span class="hidden lg:inline">transactions</span>
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/budgets">
                            <Icon name="carbon:money" /> <span class="hidden lg:inline">budgets</span>
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/statistics">
                            <Icon name="solar:chart-bold" /> <span class="hidden lg:inline">statistics</span>
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/accounts">
                            <Icon name="bytesize:creditcard" /><span class="hidden lg:inline"> accounts</span>
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/investments">
                            <Icon name="charm:chart-line" /> <span class="hidden lg:inline">investments</span>
                        </NuxtLink>
                    </li>
                </ul>
                <ul class="block lg:flex justify-end items-center right-0 w-2/12">
                    <li class="lg:mr-5">
                        <NuxtLink to="/settings">
                            <Icon name="ic:baseline-settings" size="30" />
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/user">
                            <Icon name="ph:user" size="30" />
                        </NuxtLink>
                    </li>
                </ul>
            </nav>
        </header>
        <div class="flex-grow">
            <slot />
            <!--enable notifications-->
            <UNotifications />
        </div>
        <footer class="flex justify-between bg-primary items-center px-10">
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
                <NuxtLink to="/documentation">
                    <Icon name="basil:document-outline" />documentation
                </NuxtLink>
            </div>
        </footer>
    </div>
</template>
 
<script setup>
//throw custom error
/*
if (!products.value) {
   throw createError({ statusCode: 404, statusMessage: 'Product Not Found', fatal: true })
}
*/
</script>