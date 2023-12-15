<template>
    <div class="bg-red-200">
        <h1>
            {{ error.statusCode }}
        </h1>
        <p>{{ error.message }}</p>
    </div>

    <button class="btn" @click="handleClearError">Go Home...</button>
</template>

<script setup>
defineProps(['error'])

const handleClearError = () => clearError({ redirect: '/'})
</script>