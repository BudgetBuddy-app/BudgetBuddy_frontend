<template>
    <div>
        <h2>Home</h2>
        <Login />

        <NuxtLink to="/createAccount">
            <Icon name="mingcute:plus-line" /> create an Account
        </NuxtLink>
    </div>
</template>

<script setup>

definePageMeta({
    layout: 'minimal'
})

</script>