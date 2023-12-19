import { useAuthStore } from '~/store/auth'

//TODO add cookies somehow to preserve the session between refreshes
export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()

    let isAllowedWithoutAuth = to.path !== '/' && to.path !== '/documentation' && to.path !== '/createAccount'

    if (authStore.token == '' && isAllowedWithoutAuth) {
        return navigateTo('/')
    } else if (authStore.token != '' && to.path == '/') {
        //if user is authenticated, don't allow him to go to login page
        return navigateTo('/dashboard')
    }
})
