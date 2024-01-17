<template>
    <div>
        <h2>Statistics</h2>
        <div class="flex">
            <div class="w-full lg:w-1/2 border">
                <div>Total spent per month (all accounts)</div>

                <div>
                    <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
                        <UInput v-model="q1" placeholder="Filter transactions..." />
                    </div>
                    <UTable :rows="rows1" :columns="columns1">
                        <template #actions-data="{ row }">
                            <UDropdown :items="items(row)">
                                <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                            </UDropdown>
                        </template>
                    </UTable>
                    <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
                        <UPagination v-model="page1" :page-count="pageCount1" :total="filteredRows1.length" />
                    </div>
                </div>


            </div>
            <div class="w-full lg:w-1/2">
                <div>Total net worth (sum of all accounts): {{ netWorth }} </div>
                <div v-for="account in accountList">
                    <UBadge>{{ account.name }}</UBadge>
                    <span>{{ account.total_amount }}</span>
                </div>
            </div>
        </div>
        <div>
            <div>Total spent per month per account</div>

            <div>
                <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
                    <UInput v-model="q2" placeholder="Filter transactions..." />
                </div>
                <UTable :rows="rows2" :columns="columns2">
                    <template #actions-data="{ row }">
                        <UDropdown :items="items(row)">
                            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                        </UDropdown>
                    </template>
                </UTable>
                <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
                    <UPagination v-model="page2" :page-count="pageCount2" :total="filteredRows2.length" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRuntimeConfig } from '#app'
import { useAuthStore } from '~/store/auth'

const runtimeConfig = useRuntimeConfig()
const authStore = useAuthStore();
let authenticatedUser = authStore.getAuthenticatedUser()

let accountList = ref([]);
let netWorth = ref();
let transactionSumPerMonth = ref([]);
let transactionSumPerAccountPerMonth = ref([])

const q1 = ref('');
const page1 = ref(1);
const pageCount1 = 5;
const q2 = ref('');
const page2 = ref(1);
const pageCount2 = 5;

//TODO sometimes in the small top table, the decimals are not two but like 10, 	-463.96000000000004, and I'm not sure why
//I already have a function to solve this but it's not working

//table variables
const columns1 = [
    {
        key: 'date',
        label: 'month',
        sortable: 'true',
        sortable: 'true'
    }, {
        key: 'amount',
        label: 'amount',
        sortable: 'true',
        sortable: 'true'
    }
]

const columns2 = ref([])

//functions
const filteredRows1 = computed(() => {
    if (!q1.value) {
        return transactionSumPerMonth.value;
    }

    return transactionSumPerMonth.value.filter((transaction) => {
        return Object.values(transaction).some((value) => {
            if (typeof value === 'string') {
                value = value.trim();
            }
            return String(value).toLowerCase().includes(q1.value.toLowerCase());
        });
    });
});

const rows1 = computed(() => {
    return filteredRows1.value.slice((page1.value - 1) * pageCount1, (page1.value) * pageCount1);
});

const filteredRows2 = computed(() => {
    if (!q2.value) {
        return transactionSumPerAccountPerMonth.value;
    }

    return transactionSumPerAccountPerMonth.value.filter((transaction) => {
        return Object.values(transaction).some((value) => {
            if (typeof value === 'string') {
                value = value.trim();
            }
            return String(value).toLowerCase().includes(q2.value.toLowerCase());
        });
    });
});

const rows2 = computed(() => {
    return filteredRows2.value.slice((page2.value - 1) * pageCount2, (page2.value) * pageCount2);
});

const getUserAccounts = async () => {
    try {
        const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/accounts/user/' + authenticatedUser.id, {
            method: 'GET',
        })
        accountList.value = response;
        netWorth.value = 0;

        let accountForTable = {
            key: 'date',
            label: 'month',
            sortable: 'true'
        }

        columns2.value.push(accountForTable)

        for (let account of accountList.value) {
            netWorth.value += turnIntoTwoDecimal(account.total_amount);

            //generate columns for the account list
            let accountForTable = {
                key: account.name,
                label: account.name,
                sortable: 'true'
            }
            columns2.value.push(accountForTable)
        }
    } catch (error) {
        console.error('ERROR:', error)
    }
}
getUserAccounts();

const getStatistics = async () => {
    try {
        const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/accounts/statistics/user/' + authenticatedUser.id, {
            method: 'GET',
        })

        transformStatistics(response)

    } catch (error) {
        console.error('ERROR:', error)
    }
}
getStatistics()

//TODO this could be optimized with hash maps
const transformStatistics = (rawData) => {
    let monthSums = []

    let auxMonth = {}
    let auxDate = ''

    //get how much you spent per month in all accounts
    for (let i = 0; i < rawData.length; i++) {
        auxDate = rawData[i].year + "/" + rawData[i].month

        var result = monthSums.findIndex(obj => {
            return obj.date === auxDate;
        });

        if (result >= 0) {
            monthSums[result].amount += turnIntoTwoDecimal(rawData[i].transactionSum)
        } else {
            auxMonth = {
                date: auxDate,
                amount: turnIntoTwoDecimal(rawData[i].transactionSum)
            }
            monthSums.push(auxMonth)
        }
    }
    transactionSumPerMonth.value = monthSums

    //get how much you spent per month, per account
    let accountSums = []
    let auxObj = {}

    for (let i = 0; i < rawData.length; i++) {
        auxDate = rawData[i].year + "/" + rawData[i].month


        var result = accountSums.findIndex(obj => {
            return obj.date === auxDate;
        });

        if (result >= 0) {
            accountSums[result][rawData[i].account_name] = rawData[i].transactionSum

        } else {
            auxObj = {}
            auxObj.date = auxDate
            auxObj[rawData[i].account_name] = rawData[i].transactionSum

            accountSums.push(auxObj)

        }
    }
    transactionSumPerAccountPerMonth.value = accountSums
}

const turnIntoTwoDecimal = (number) => {
    return parseFloat(parseFloat(number).toFixed(2));
}
</script>