import { defineStore } from 'pinia'
import { useRuntimeConfig } from '#app'

export const useAuthStore = defineStore('authStore', () => {
    const runtimeConfig = useRuntimeConfig()
    let accessToken = ''
    let currentToken = ''
    validateTokenOnStart()
    async function validateTokenOnStart() {
        try {
            //1 day expiry date
            accessToken = useCookie('accessToken', { maxAge: 86400 })
            currentToken = accessToken.value
            //TODO find a way to make these paths constant
            const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/auth/validate', {
                method: 'GET',
                headers: {
                    'access-token': accessToken.value
                }
            })
            if (!response) {
                accessToken.value = ''
            }
        } catch (error) {
            //TODO; show error to user or smthn, Handle login error
            console.error('Cookie authentication failed:', error)
        }
    }

    function setToken(newToken) {
        accessToken.value = newToken
    }

    function removeToken() {
        accessToken.value = ''
    }

    function isAuthenticated() {
        return accessToken.value != ''
    }

    return { setToken, removeToken, isAuthenticated }
})
