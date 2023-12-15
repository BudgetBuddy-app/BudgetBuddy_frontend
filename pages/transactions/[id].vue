<template>
    <div>
        <h2>Transaction id: {{ id }} </h2>
    </div>
</template>

<script setup>

const { id } = useRoute().params

</script>