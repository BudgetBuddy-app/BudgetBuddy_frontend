<template>
    <div class="bg-red-200">
        <h1>
            {{ error.statusCode }}
        </h1>
        <p>{{ error.message }}</p>
    </div>

    <UButton @click="handleClearError">Go Home...</UButton>
</template>
 
<script setup>
const props = defineProps(['error'])

onMounted(() => {
    console.error(props.error)
})

const handleClearError = () => {
    clearError({ redirect: '/' })
}
</script>
 