<template>
  <UModal :modelValue="isOpen" @update:modelValue="val => $emit('update:isOpen', val)">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <h2 class="h-8">{{ mode }} transaction</h2>
      </template>

      <form v-if="mode != 'Delete'" @submit.prevent="submitForm">
        <label>Amount:</label>
        <UInput type="decimal" v-model="transactionForm.amount" />
        <label>Date (mm/dd/yyyy):</label>
        <UInput type="date" v-model="transactionForm.date" />
        <label>Recipient:</label>
        <UInput type="text" v-model="transactionForm.recipient" />
        <label>Category:</label>
        <div>
          current categories: <UBadge v-for="category in categoryList" class="mr-1">{{ category.name }}</UBadge>
        </div>
        <UInput type="text" v-model="transactionForm.category" />
        <label>Account:</label>
        <USelectMenu searchable v-model="selectedAccount" :options="accountList" option-attribute="name" />
        <label>Notes:</label>
        <UInput type="text" v-model="transactionForm.notes" />
        <UButton type="submit">Submit</UButton>
      </form>
      <div v-else class="flex flex-col items-center">
        <div class="pb-4">Are you sure you want to delete this transaction?</div>
        <UButton @click="submitForm" color="red" size="xl">DELETE</UButton>
      </div>

      <template #footer>
        <div class="h-8 mb-10">
          <span v-if="mode != 'Delete'">
            For withdrawals, submit a <b>negative</b> number. <br />
            In case the recipient does not exist, it will be created. <br />
            In case the category does not exist, it will be created.
          </span>
          <span v-else><b>WARNING:</b> This change is permanent!</span>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
import { useRuntimeConfig } from '#app'
import { useAuthStore } from '~/store/auth'

const runtimeConfig = useRuntimeConfig()
const authStore = useAuthStore();
let authenticatedUser = authStore.getAuthenticatedUser()
const toast = useToast()

const props = defineProps({
  isOpen: Boolean,
  mode: String,
  transactionToEdit: Object,
  parentAccount: Object
})

const emit = defineEmits(['update:isOpen', 'refreshList', 'closeModal'])

let transactionForm = {};
let accountList = ref([]);
let categoryList = ref([]);
const selectedAccount = ref(accountList[0])

//TODO add a button on the transaction details page that also opens this modal to edit it

//TODO add an option for categories to be selectable, or to imput a new one on the same line 

//TODO if no account selected, gives error, but account should be optional, make a specific option that sends null to the DB
const submitForm = async () => {
  try {

    let responseText = ''
    if (props.mode == 'Create') {
      transactionForm.account_id = selectedAccount.value.id
      const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/transactions', {
        method: 'POST',
        body: JSON.stringify(transactionForm),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      responseText = 'Transaction created'
      emit('closeModal');
    } else if (props.mode == 'Edit') {
      transactionForm.account_id = selectedAccount.value.id
      const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/transactions/' + props.transactionToEdit.id, {
        method: 'PUT',
        body: JSON.stringify(transactionForm),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      responseText = 'Transaction edited'
    } else if (props.mode == 'Delete') {
      const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/transactions/' + props.transactionToEdit.id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      responseText = 'Transaction deleted'
      emit('closeModal');
    }

    toast.add({ title: "Success: " + responseText })
    emit('refreshList');

  } catch (error) {
    toast.add({ title: "ERROR: " + error })
  }
};

const getUserAccounts = async () => {
  try {
    const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/accounts/user/' + authenticatedUser.id, {
      method: 'GET',
    })
    accountList.value = response;
  } catch (error) {
    console.error('ERROR:', error)
  }
}
getUserAccounts();

const getCategories = async () => {
  try {
    const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/categories/user/' + authenticatedUser.id, {
      method: 'GET',
    })
    categoryList.value = response;
  } catch (error) {
    console.error('ERROR:', error)
  }
}
getCategories();

const cleanTransaction = () => {
  transactionForm = {
    amount: 0,
    date: new Date().toISOString().split('T')[0], // Set default date to today    
    recipient: '',
    category: '',
    account_id: '',
    notes: ''
  };
}
cleanTransaction();

watch(() => props.isOpen, (newVal, oldVal) => {
  getCategories();
  getUserAccounts();

  if (props.mode == 'Edit') {
    transactionForm = props.transactionToEdit
    if (transactionForm.date) {
      transactionForm.date = transactionForm.date.split('T')[0]
    }
  }
  if (props.parentAccount) {
    selectedAccount.value = accountList.value.find(account => account.id === props.parentAccount.id);
  }
  if (!newVal && oldVal) {
    cleanTransaction()
  }
});
</script>