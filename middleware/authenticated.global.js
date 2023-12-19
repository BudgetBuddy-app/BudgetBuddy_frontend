import { useAuthStore } from '~/store/auth'

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()

    if (authStore.token == '' && to.path !== '/' && to.path !== '/documentation') {
        // Redirect the user to the login page or show a message
        return navigateTo('/')
    }
})
