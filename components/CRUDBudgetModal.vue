<template>
  <UModal :modelValue="isOpen" @update:modelValue="val => $emit('update:isOpen', val)">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <h1 class="h-8">{{ mode }} Budget </h1>
      </template>

      <form v-if="mode != 'Delete'" @submit.prevent="submitForm">
        <label>Name:</label>
        <UInput type="name" v-model="budgetForm.name" />
        <label>Start (mm/dd/yyyy):</label>
        <UInput type="date" v-model="budgetForm.start_date" />
        <label>Date (mm/dd/yyyy):</label>
        <UInput type="date" v-model="budgetForm.end_date" />
        <label>Amount:</label>
        <UInput type="decimal" v-model="budgetForm.amount" />
        <UButton type="submit">Submit</UButton>
      </form>

      <div v-else class="flex flex-col items-center">
        <div class="pb-4">Are you sure you want to delete the <b>{{ budgetToEdit.name }}</b> budget?</div>
        <UButton @click="submitForm" color="red" size="xl">DELETE</UButton>
      </div>

      <template #footer>
        <div class="h-8">
          <span v-if="mode != 'Delete'">There can be many budgets with the same name.</span>
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
  budgetToEdit: Object
})

const emit = defineEmits(['update:isOpen', 'refreshList', 'closeModal'])

let budgetForm = {};

const authStore = useAuthStore();
let authenticatedUser = authStore.getAuthenticatedUser()
const userId = computed(() => authenticatedUser.id)

const submitForm = async () => {
  try {
    let responseText = ''
    if (props.mode == 'Create') {
      budgetForm.user_id = userId.value
      const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/budgets', {
        method: 'POST',
        body: JSON.stringify(budgetForm),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      responseText = 'Budget created'
      emit('closeModal');
    } else if (props.mode == 'Edit') {
      const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/budgets/' + props.budgetToEdit.id, {
        method: 'PUT',
        body: JSON.stringify(budgetForm),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      responseText = 'Budget edited'
    } else if (props.mode == 'Delete') {
      const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/budgets/' + props.budgetToEdit.id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      responseText = 'Budget deleted'
      emit('closeModal');
    }

    toast.add({ title: "Success: " + responseText })
    emit('refreshList');

  } catch (error) {
    toast.add({ title: "ERROR: " + error })
  }
};

const cleanBudget = () => {
  budgetForm = {
    name: '',
    amount: 0,
    start_date: '',
    end_date: '',
    user_id: null
  };
}
cleanBudget();

watch(() => props.isOpen, (newVal, oldVal) => {

  if (props.mode == 'Edit') {
    budgetForm = props.budgetToEdit
  }
  if (!newVal && oldVal) {
    cleanBudget()
  }
});
</script>