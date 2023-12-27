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
    //TODO set a variable in the .env for debugging, that enables console.logs like this throughout the app that the user shouldn't normally see
    console.log(props.error)
})

const handleClearError = () => {
    clearError({ redirect: '/' })
}
</script>
 