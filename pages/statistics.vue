<template>
    <div>
        <h2>Statistics</h2>
        <div class="flex">
            <div class="w-full lg:w-1/2 border">
                <div>Total spent per month (all accounts)</div>
                <CustomTable :columns="columns1" :itemList="transactionSumPerMonth" />
            </div>
            <div class="w-full lg:w-1/2">
                <NetWorthStatistics :accountList="accountList" />
            </div>
        </div>
        <div>
            <div>Total spent per month per account</div>
            <CustomTable :columns="columns2" :itemList="transactionSumPerAccountPerMonth" />
        </div>
    </div>
</template>

<script setup>
//setups and imports
import { useRuntimeConfig } from '#app'
import { useAuthStore } from '~/store/auth'

const runtimeConfig = useRuntimeConfig()
const authStore = useAuthStore();
let authenticatedUser = authStore.getAuthenticatedUser()

let accountList = ref([]);
let transactionSumPerMonth = ref([]);
let transactionSumPerAccountPerMonth = ref([])

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
const getUserAccounts = async () => {
    try {
        const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/accounts/user/' + authenticatedUser.id, {
            method: 'GET',
        })
        accountList.value = response;

        let accountForTable = {
            key: 'date',
            label: 'month',
            sortable: 'true'
        }

        columns2.value.push(accountForTable)

        for (let account of accountList.value) {

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
        // Pad the month with a leading zero if it's less than  10
        auxDate = rawData[i].year + "-" + ("0" + rawData[i].month).slice(-2);

        var result = monthSums.findIndex(obj => {
            return obj.date === auxDate;
        });

        if (result >= 0) {
            monthSums[result].amount += turnIntoFloat(rawData[i].transactionSum)
        } else {
            auxMonth = {
                date: auxDate,
                amount: turnIntoFloat(rawData[i].transactionSum)
            }
            monthSums.push(auxMonth)
        }
    }
    transactionSumPerMonth.value = monthSums

    //get how much you spent per month, per account
    let accountSums = []
    let auxObj = {}

    for (let i = 0; i < rawData.length; i++) {
        // Pad the month with a leading zero if it's less than  10
        auxDate = rawData[i].year + "-" + ("0" + rawData[i].month).slice(-2);

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

const turnIntoFloat = (number) => {
    return parseFloat(parseFloat(number).toFixed(2));
}
</script>