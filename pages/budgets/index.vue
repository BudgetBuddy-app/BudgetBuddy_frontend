<template>
    <div>
        <h2>Budgets</h2>

        <div class="flex items-center">
            <UButton label="Create budget" @click="isOpen = true; mode = 'Create'" />
            <UButton @click="getBudgets(); toast.add({ title: 'Refreshing list... ' })">
                <Icon name="ic:baseline-refresh" />
            </UButton>
        </div>
        <CRUDBudgetModal :isOpen="isOpen" :mode="mode" :budgetToEdit="budgetToEdit" @update:isOpen="isOpen = $event"
            @refreshList="getBudgets()" @closeModal="closeModal()" />

        <CustomTable :columns="columns" :items="items" :itemList="budgetList" />
    </div>
</template>

<script setup>
//setups and imports
import { useRuntimeConfig } from '#app'
import { useAuthStore } from '~/store/auth'

const toast = useToast()
const runtimeConfig = useRuntimeConfig()
const authStore = useAuthStore();
let authenticatedUser = authStore.getAuthenticatedUser()

let budgetList = ref([]);
const isOpen = ref(false)
const mode = ref('')
const budgetToEdit = ref({})
const transactionList = ref([])

//table variables
const columns = [
    {
        key: 'id',
        label: 'ID',
        sortable: 'true'
    }, {
        key: 'name',
        label: 'Name',
        sortable: 'true'
    }, {
        key: 'start_date_short',
        label: 'Start Date',
        sortable: 'true'
    }, {
        key: 'end_date_short',
        label: 'End Date',
        sortable: 'true'
    }, {
        key: 'amount',
        label: 'Expected Amount',
        sortable: 'true'
    }, {
        key: 'spent',
        label: 'Spent Amount',
        sortable: 'true'
    }, {
        key: 'amountLeft',
        label: 'Amount Left (or overspent)',
        sortable: 'true'
    }, {
        key: 'amountLeftPerDay',
        label: 'Amount Left (or overspent) per day',
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

//functions
const reDirect = async (type, row) => {
    if (type == 'Details') {
        await navigateTo('/budgets/' + row.id);
    } else {
        mode.value = type
        budgetToEdit.value = row
        isOpen.value = true
    }
}

const getBudgets = async () => {
    try {
        let response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/budgets/user/' + authenticatedUser.id, {
            method: 'GET',
        })

        for (let i = 0; i < response.length; i++) {

            response[i].start_date_short = response[i].start_date.split('T')[0];
            response[i].end_date_short = response[i].end_date.split('T')[0];
        }

        budgetList.value = response;
        getTransactions();
    } catch (error) {
        console.error('ERROR:', error)
    }
}
getBudgets();

const getTransactions = async () => {
    try {
        const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/transactions/user/' + authenticatedUser.id, {
            method: 'GET',
        })

        transactionList.value = response;

        //count the value spent on each budget
        for (let i = 0; i < budgetList.value.length; i++) {
            let budget = budgetList.value[i];
            let auxBudgetStartDate = new Date(budget.start_date);
            let auxBudgetEndDate = new Date(budget.end_date);
            budget.spent = 0;

            for (let j = 0; j < transactionList.value.length; j++) {
                let transaction = transactionList.value[j];
                let auxTransactionDate = new Date(transaction.date);

                if (auxBudgetEndDate >= auxTransactionDate && auxBudgetStartDate <= auxTransactionDate) {
                    budget.spent += parseFloat(transaction.amount);
                }
            }

            budget.amountLeft = parseFloat(budget.amount) + parseFloat(budget.spent)
            budget.amountLeftPerDay = budget.amountLeft / calculateDaysBetween(auxBudgetStartDate, auxBudgetEndDate)
        }
    } catch (error) {
        console.error('ERROR:', error)
    }
}

const closeModal = () => {
    isOpen.value = false
}

function calculateDaysBetween(date1, date2) {
    const oneDay = 1000 * 60 * 60 * 24; // Milliseconds in a day
    const date1Time = date1.getTime();
    const date2Time = date2.getTime();

    // Ensure date1 is the earliest date
    if (date1Time > date2Time) {
        [date1Time, date2Time] = [date2Time, date1Time];
    }

    // Calculate the difference in time and convert to days
    const diffInDays = Math.round(Math.abs(date2Time - date1Time) / oneDay);
    return diffInDays;
}
</script>