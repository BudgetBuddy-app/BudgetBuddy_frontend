<template>
    <body>
        <h2>Transaction id: {{ id }} </h2>
    </body>
</template>

<script setup>

const { id } = useRoute().params

</script>