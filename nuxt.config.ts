// https://nuxt.com/docs/api/configuration/nuxt-config

//the alias is  to fix a pinia bug
//https://stackoverflow.com/questions/74003458/cannot-find-module-pinia-dist-pinia-mjs-when-using-run-dev

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt'
  ],
  alias: {
    pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs"
  },
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
      BACKEND_API_BASE_PATH: process.env.BACKEND_API_BASE_PATH || "http://localhost:5000",
      YAHOO_FINANCE_API_KEY: process.env.YAHOO_FINANCE_API_KEY || ''
    }
  }
})
