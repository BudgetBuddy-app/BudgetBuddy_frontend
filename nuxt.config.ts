// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    '@pinia/nuxt'
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
    public: {
      BACKEND_API_BASE_PATH: process.env.BACKEND_API_BASE_PATH || "http://localhost:3001"
    }
  }
})
