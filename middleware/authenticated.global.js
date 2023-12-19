import { useAuthStore } from '~/store/auth'

//TODO add cookies somehow to preserve the session between refreshes
export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()

    let isNotAllowedWithoutAuth = to.path !== '/' && to.path !== '/documentation' && to.path !== '/createAccount'

    console.log("DEBUG", authStore.isAuthenticated(), isNotAllowedWithoutAuth)
    if (!authStore.isAuthenticated() && isNotAllowedWithoutAuth) {
        return navigateTo('/')
    } else if (authStore.isAuthenticated() && to.path == '/') {
        //if user is authenticated, don't allow him to go to login page
        return navigateTo('/dashboard')
    }
})
