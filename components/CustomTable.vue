<template>
    <div>
        <div>
            <div class="flex space-x-4">
                <div>
                    <UInput v-model="q" placeholder="Filter items..." />
                </div>
                <USelect v-model="itemsPerPageComputed" :options="pageCounts" />
                <div>
                    <UPagination v-model="page" :page-count="itemsPerPage" :total="filteredRows.length" />
                </div>
            </div>
            <UTable :rows="rows" :columns="columns">
                <template #actions-data="{ row }">
                    <UDropdown :items="items(row)">
                        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                    </UDropdown>
                </template>
            </UTable>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    columns: Array,
    items: Function,
    itemList: Array
})

let totalItems = computed(() => {
    return props.itemList.length;
});
const pageCounts = ref([10, 20, 50, 100, totalItems])

const q = ref('');
const page = ref(1);
const itemsPerPage = ref(pageCounts.value[0]);

watch(itemsPerPage, () => {
    page.value = 1;
});

const itemsPerPageComputed = computed({
    get: () => itemsPerPage.value,
    set: (val) => {
        itemsPerPage.value = Number(val);
    },
});

const filteredRows = computed(() => {
    if (!q.value) {
        return props.itemList;
    }

    return props.itemList.filter((transaction) => {
        return Object.values(transaction).some((value) => {
            if (typeof value === 'string') {
                value = value.trim();
            }
            return String(value).toLowerCase().includes(q.value.toLowerCase());
        });
    });
});

const rows = computed(() => {
    return filteredRows.value.slice((page.value - 1) * itemsPerPage.value, (page.value) * itemsPerPage.value);
});

</script>