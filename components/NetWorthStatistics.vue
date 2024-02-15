<template>
    <div>
        <div>Total net worth (sum of all accounts): {{ netWorth }} </div>
        <div v-for="account in accountList">
            <UBadge>{{ account.name }}</UBadge>
            <span>{{ account.total_amount }}</span>
        </div>
    </div>
</template>
   
<script setup>
import { useRuntimeConfig } from '#app'
import { useAuthStore } from '~/store/auth'

const props = defineProps({
    accountList: Array,
})

const runtimeConfig = useRuntimeConfig()
const authStore = useAuthStore();
let authenticatedUser = authStore.getAuthenticatedUser()

const investmentList = ref([])

const netWorth = ref(0);

onMounted(async () => {
    await calculateNetWorth();
});

const calculateNetWorth = async () => {
    await getInvestments();

    //get total investment value
    let totalInvestmentWorth = 0;
    for (let i = 0; i < investmentList.value.length; i++) {
        totalInvestmentWorth += investmentList.value[i].price * investmentList.value[i].owned_shares;
    }

    props.accountList.push({
        name: 'investments',
        total_amount: totalInvestmentWorth.toFixed(2),
    });

    //get total value of all accounts
    let netWorthSum = 0;
    for (let account of props.accountList) {
        netWorthSum += parseFloat(account.total_amount);
    }

    netWorth.value = netWorthSum.toFixed(2);
};

const getInvestments = async () => {
    try {
        const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/investments/user/' + authenticatedUser.id, {
            method: 'GET',
        })

        investmentList.value = response;
    } catch (error) {
        console.error('ERROR:', error)
    }
}

</script>