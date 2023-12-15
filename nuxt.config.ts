// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  app: {
    head: {
      title: 'Budget Buddy',
      meta: [
        {
          name: 'description', content: 'budget manager'
        }
      ]
    }
  },
  runtimeConfig: {
    apiBasePath: process.env.BACKEND_API_BASE_PATH,
      public: {
        apiBasePath: process.env.BACKEND_API_BASE_PATH
      }
  }
})
