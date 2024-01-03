import { defineStore } from 'pinia'
import { useRuntimeConfig } from '#app'

export const useAuthStore = defineStore('authStore', () => {
    const runtimeConfig = useRuntimeConfig()
    let accessToken = {}
    accessToken.value = ''
    let currentToken = ''
    let currentUser = null
    validateTokenOnStart()
    async function validateTokenOnStart() {
        try {
            //1 day expiry date
            accessToken = useCookie('accessToken', { maxAge: 86400 })
            currentToken = accessToken.value
            const response = await $fetch(runtimeConfig.public.BACKEND_API_BASE_PATH + '/auth/validate', {
                method: 'GET',
                headers: {
                    'access-token': accessToken.value
                }
            })
            if (!response.Validation) {
                accessToken.value = ''
            } else {
                setAuthenticatedUser(response.User)
            }
        } catch (error) {
            removeToken()
        }
    }

    function setToken(newToken) {
        accessToken.value = newToken
    }

    function removeToken() {
        accessToken.value = ''
        currentUser = null
    }

    function isAuthenticated() {
        return accessToken.value != ''
    }

    function setAuthenticatedUser(userData) {
        currentUser = userData
    }

    function getAuthenticatedUser() {
        return currentUser
    }

    return { setToken, removeToken, isAuthenticated, setAuthenticatedUser, getAuthenticatedUser }
})
