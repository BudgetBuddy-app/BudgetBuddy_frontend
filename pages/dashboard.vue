<template>
    <body>
        <h2>Dashboard</h2>
        <div v-for="number in numbers">{{ number }}</div>

    </body>
</template>

<script setup>

//TODO remove this, as it is only here to test the footer length
let numbers = []
for(let i=0;i<50;i++){
    numbers.push(i)
}

</script>