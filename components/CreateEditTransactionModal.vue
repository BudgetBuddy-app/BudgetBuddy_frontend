<template>
  <UModal :modelValue="isOpen" @update:modelValue="val => $emit('update:isOpen', val)">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <h2 class="h-8">Create transaction</h2>
      </template>

      <form @submit.prevent="submitForm">
        <label>Amount:</label>
        <UInput type="number" v-model="transactionToCreate.amount" />
        <label>Type:</label>
        <UInput type="type" v-model="transactionToCreate.type" />
        <label>Date:</label>
        <UInput type="date" v-model="transactionToCreate.date" />
        <label>Recipient:</label>
        <UInput type="text" v-model="transactionToCreate.recipient" />
        <label>Account:</label>
        <UInput type="text" v-model="transactionToCreate.account" />
        <label>Notes:</label>
        <UInput type="text" v-model="transactionToCreate.notes" />
        <UButton type="submit">Submit</UButton>
      </form>

      <template #footer>
        <div class="h-8">In case the recipient does not exist, it will be created.</div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
})

let transactionToCreate = {
  amount: 0,
  type: '',
  date: null,
  recipient: '',
  account: '',
  notes: ''
};

const submitForm = async () => {
  //TODO post a new transaction
  try {
    accountToCreate.user_id = authenticatedUser.id
    const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/accounts', {
      method: 'POST',
      body: JSON.stringify(accountToCreate),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    //TODO make this a popup, not a console log
    console.log("Success: ", response)

    //TODO guarantee this emit works
    emit('submitForm');

    getUserAccounts();

  } catch (error) {
    console.error('ERROR:', error)
  }

};
</script>