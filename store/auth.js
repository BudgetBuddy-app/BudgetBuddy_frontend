import { defineStore } from 'pinia'

export const useAuthStore = defineStore('authStore', () => {
    //1 day expiry date
    let accessToken = ''
    let currentToken = ''
    validateTokenOnStart()
    async function validateTokenOnStart() {
        try {
            accessToken = useCookie('accessToken', { maxAge: 86400 })
            currentToken = accessToken.value
            //TODO find a way to make these paths constant
            const response = await $fetch('http://localhost:3001/auth/validate', {
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
