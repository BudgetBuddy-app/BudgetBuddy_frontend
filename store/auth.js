import { defineStore } from 'pinia'

export const useAuthStore = defineStore('authStore', () => {
    const token = ref(typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '')

    function setToken(newToken) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', newToken)
            token.value = newToken
        }
    }

    function removeToken() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token')
            token.value = ''
        }
    }

    return { token, setToken, removeToken }
})
