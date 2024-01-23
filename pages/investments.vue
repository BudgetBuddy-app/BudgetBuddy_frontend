<template>
    <div>
        <h2>Investments</h2>

        <div class="flex items-center">
            <UButton label="Add holding" @click="isOpen = true; mode = 'Create'" />
            <UButton @click="refreshAPI(); toast.add({ title: 'Refreshing Holdings... ' })">
                <Icon name="ic:baseline-refresh" /> refresh API
            </UButton>
            <UButton @click="getInvestments(); toast.add({ title: 'Refreshing Holdings... ' })">
                <Icon name="ic:baseline-refresh" /> refresh Table
            </UButton>
        </div>

        <CRUDInvestmentModal :isOpen="isOpen" :mode="mode" :investmentToCRUD="investmentToCRUD"
            @update:isOpen="isOpen = $event" @refreshList="getInvestments()" @closeModal="closeModal()" />

        <div>
            <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
                <UInput v-model="q" placeholder="Filter investments..." />
            </div>
            <UTable :rows="rows" :columns="columns">
                <template #actions-data="{ row }">
                    <UDropdown :items="items(row)">
                        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                    </UDropdown>
                </template>
            </UTable>
            <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
                <UPagination v-model="page" :page-count="pageCount" :total="filteredRows.length" />
            </div>
        </div>
    </div>
</template>

<script setup>
//setups and imports
import { useRuntimeConfig } from '#app'
import { useAuthStore } from '~/store/auth'

const toast = useToast()
const runtimeConfig = useRuntimeConfig()
const yahooKey = runtimeConfig.public.YAHOO_FINANCE_API_KEY
const authStore = useAuthStore();
let authenticatedUser = authStore.getAuthenticatedUser()

const isOpen = ref(false)
const mode = ref('')
const investmentToCRUD = ref({})

const q = ref('');
const page = ref(1);
const pageCount = 10;

const investmentList = ref([])

//TODO add warning saying tht the refreshes per month are limited

//table variables 
const columns = [
    {
        key: 'id',
        label: 'ID',
        sortable: 'true'
    }, {
        key: 'name',
        label: 'Amount',
        sortable: 'true'
    }, {
        key: 'symbol',
        label: 'symbol',
        sortable: 'true'
    }, {
        key: 'last_refreshed',
        label: 'last refreshed (yyyy-mm-dd)',
        sortable: 'true'
    }, {
        key: 'exchange',
        label: 'exchange',
        sortable: 'true'
    }, {
        key: 'currency',
        label: 'currency',
        sortable: 'true'
    }, {
        key: 'currency_symbol',
        label: 'currency symbol',
        sortable: 'true'
    }, {
        key: 'price',
        label: 'price',
        sortable: 'true'
    }, {
        key: 'average_purchase_price',
        label: 'average purchase price',
        sortable: 'true'
    }, {
        key: 'owned_shares',
        label: 'owned shares',
        sortable: 'true'
    }, {
        key: 'actions'
    }
]

const items = (row) => [
    [{
        label: 'Details',
        icon: 'heroicons:information-circle-20-solid',
        click: () => reDirect('Details', row)
    }],
    [{
        label: 'Edit',
        icon: 'i-heroicons-pencil-square-20-solid',
        click: () => reDirect('Edit', row)
    }, {
        label: 'Delete',
        icon: 'i-heroicons-trash-20-solid',
        click: () => reDirect('Delete', row)
    }]
]

//table functions
const filteredRows = computed(() => {
    if (!q.value) {
        return investmentList.value;
    }

    return investmentList.value.filter((transaction) => {
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

const reDirect = async (type, row) => {
    switch (type) {
        case 'Details':
            await navigateTo('/transactions/' + row.id);
            break;
        case 'Edit':
            mode.value = 'Edit'
            investmentToCRUD.value = row
            isOpen.value = true
            break;
        case 'Delete':
            mode.value = 'Delete'
            investmentToCRUD.value = row
            isOpen.value = true
            break;
        default:
            console.error('Invalid type');
    }
}

const closeModal = () => {
    isOpen.value = false
}

//other functions
const refreshAPI = async () => {

    for (let i = 0; i < investmentList.value.length; i++) {
        const url = 'https://yh-finance.p.rapidapi.com/stock/v2/get-summary?symbol=' + investmentList.value[i].symbol;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': yahooKey,
                'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.text();
            const fullInvestmentInfo = JSON.parse(result)

            let stockResponse = {
                price: fullInvestmentInfo.price.regularMarketPrice.raw,
                currency: fullInvestmentInfo.price.currency,
                currency_symbol: fullInvestmentInfo.price.currencySymbol,
                exchange: fullInvestmentInfo.price.exchange,
                name: fullInvestmentInfo.price.longName,

            }

            $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/investments/yahoo/' + investmentList.value[i].id, {
                method: 'PUT',
                body: JSON.stringify(stockResponse),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

        } catch (error) {
            console.error(error);
            toast.add({ title: 'Error refreshing API...' })
        }
    }

    getInvestments()
}

const getInvestments = async () => {
    try {
        const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/investments/user/' + authenticatedUser.id, {
            method: 'GET',
        })

        //turn all dates into a readable format
        let auxArray = response;

        for (let i = 0; i < auxArray.length; i++) {
            if (auxArray[i].last_refreshed) {
                auxArray[i].last_refreshed = auxArray[i].last_refreshed.split('T')[0] + " | " + auxArray[i].last_refreshed.split('T')[1].slice(0, - 1);
            }
        }

        investmentList.value = auxArray;

        calculateStatisicstOnInvestments()
    } catch (error) {
        console.error('ERROR:', error)
    }
}
getInvestments()

const calculateStatisicstOnInvestments = () => {
    console.log("calculating...")

    //TODO calculate al this useful info and display it
    //maybe display this in dasboard or statistics instead?
    //make a component with all this info and put it everywhere, maybe do the same with spenditure per account
    /*
        let pricePaid = ownedShares * averagePurchasePrice
        let currentPrice = ownedShares * stock.price
        let markup = ((currentPrice / pricePaid) * 100) - 100
        */
}

//TODO add comment saying that the price of the stock might be inaccurate,
//innacuracies upt to 0.01 have been noted, normally due to rounding errors
</script>