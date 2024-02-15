<template>
  <UModal :modelValue="isOpen" @update:modelValue="val => $emit('update:isOpen', val)">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <h1 class="h-8">{{ mode }} Investment </h1>
      </template>

      <form v-if="mode !== 'Delete'" @submit.prevent="submitForm">
        <label>Symbol:</label>
        <UInput type="text" v-model="investmentForm.symbol" />
        <label>Owned shares:</label>
        <UInput type="decimal" v-model="investmentForm.owned_shares" />
        <label>Average purchase price:</label>
        <UInput type="decimal" v-model="investmentForm.average_purchase_price" />
        <UButton type="submit">Submit</UButton>
      </form>
      <div v-else class="flex flex-col items-center">
        <div class="pb-4">Are you sure you want to delete the <br /> <b> {{ props.investmentToCRUD.symbol }}</b>
          investment?</div>
        <UButton @click="submitForm" color="red" size="xl" @submit.prevent="submitForm">DELETE</UButton>
      </div>

      <template #footer>
        <div class="h-8">
          <span v-if="mode != 'Delete'">The rest of the information of the stock will be fetched automatically</span>
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
const toast = useToast()

const props = defineProps({
  isOpen: Boolean,
  mode: String,
  investmentToCRUD: Object
})

const emit = defineEmits(['update:isOpen', 'closeModal', 'refreshList'])

const authStore = useAuthStore();
let authenticatedUser = authStore.getAuthenticatedUser()

let investmentForm = {};

const submitForm = async () => {
  try {
    let responseText = ''
    if (props.mode == 'Create') {
      const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/investments', {
        method: 'POST',
        body: JSON.stringify(investmentForm),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      responseText = 'Investment created'
      emit('closeModal', 'refreshList');
      emit('refreshList')
    } else if (props.mode == 'Edit') {
      const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/investments/' + props.investmentToCRUD.id, {
        method: 'PUT',
        body: JSON.stringify(investmentForm),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      responseText = 'Investment edited'
    } else if (props.mode == 'Delete') {
      const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/investments/' + props.investmentToCRUD.id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      responseText = 'Investment deleted'
      emit('closeModal');
      emit('refreshList')
    }

    toast.add({ title: "Success: " + responseText })

  } catch (error) {
    toast.add({ title: "ERROR: " + error })
  }
};

const cleanInvestmentForm = () => {
  investmentForm = {
    user_id: authenticatedUser ? authenticatedUser.id : '',
    symbol: '',
    owned_shares: 0,
    average_purchase_price: 0,
  };

}
cleanInvestmentForm()

watch(() => props.isOpen, (newVal, oldVal) => {

  if (props.mode == 'Edit') {
    investmentForm = props.investmentToCRUD
    if (investmentForm.last_refreshed) {
      investmentForm.last_refreshed = investmentForm.last_refreshed.split('T')[0]
    }
  }

  if (!newVal && oldVal) {
    cleanInvestmentForm()
  }
});
</script>