<template>
    <body>
        <h2>Account id: {{ id }} </h2>
    </body>
</template>

<script setup>

const { id } = useRoute().params

</script>