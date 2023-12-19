<template>
    <div>
        <h2>Account id: {{ id }} </h2>
    </div>
</template>

<script setup>

const { id } = useRoute().params

</script>