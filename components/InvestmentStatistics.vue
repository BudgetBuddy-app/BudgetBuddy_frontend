<template>
    <div>
        Total statisitcs sums:
        <div>Total invested: {{ statisticSums.totalInvested }}</div>
        <div>Total gained: {{ statisticSums.totalGain }}</div>
        <div>Total portfolio worth: {{ statisticSums.totalPortfolio }}</div>

    </div>
    <div>
        <div>
            <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
                <UInput v-model="q" placeholder="Filter investments..." />
            </div>
            <UTable :rows="rows" :columns="columns" />
            <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
                <UPagination v-model="page" :page-count="pageCount" :total="filteredRows.length" />
            </div>
        </div>
    </div>
</template>
   
<script setup>
const props = defineProps({
    investmentList: Array,
    calculateStatistics: Boolean
})

const q = ref('');
const page = ref(1);
const pageCount = 10;

const investmentStatisitcs = ref([])
const statisticSums = ref({})

//table variables 
const columns = [
    {
        key: 'symbol',
        label: 'symbol',
        sortable: 'true'
    }, {
        key: 'pricePaid',
        label: 'Total Price Paid',
        sortable: 'true'
    }, {
        key: 'currentTotalPrice',
        label: 'Current Total Price (all shares)',
        sortable: 'true'
    }, {
        key: 'markup',
        label: 'Markup',
        sortable: 'true'
    }, {
        key: 'gain',
        label: 'Gain',
        sortable: 'true'
    }
]

//table functions
const filteredRows = computed(() => {
    if (!q.value) {
        return investmentStatisitcs.value;
    }

    return investmentStatisitcs.value.filter((transaction) => {
        return Object.values(transaction).some((value) => {
            if (typeof value === 'string') {
                value = value.trim();
            }
            return String(value).toLowerCase().includes(q.value.toLowerCase());
        });
    });
});

const rows = computed(() => {
    return filteredRows.value.slice((page.value - 1) * pageCount, (page.value) * pageCount);
});

//other functions
const calculateStatisicstOnInvestments = () => {

    statisticSums.value.totalInvested = 0
    statisticSums.value.totalGain = 0
    statisticSums.value.totalPortfolio = 0

    let auxList = []
    let auxObj = {}
    for (let i = 0; i < props.investmentList.length; i++) {
        auxObj = {}
        auxObj.symbol = props.investmentList[i].symbol
        auxObj.pricePaid = props.investmentList[i].owned_shares * props.investmentList[i].average_purchase_price
        auxObj.currentTotalPrice = props.investmentList[i].owned_shares * props.investmentList[i].price
        auxObj.markup = ((auxObj.currentTotalPrice / auxObj.pricePaid) * 100) - 100
        auxObj.gain = auxObj.currentTotalPrice - (props.investmentList[i].average_purchase_price * props.investmentList[i].owned_shares)

        auxList.push(auxObj)

        statisticSums.value.totalInvested += auxObj.pricePaid
        statisticSums.value.totalGain += auxObj.gain
        statisticSums.value.totalPortfolio += auxObj.currentTotalPrice
    }
    investmentStatisitcs.value = auxList
}

watch(() => props.calculateStatistics, (newVal, oldVal) => {
    calculateStatisicstOnInvestments()
});

</script>
   