import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/apollo',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    //...
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  runtimeConfig: {
    public: {
      rpcEndpoint: 'https://go.getblock.io/65ef9c5d71c1477bb8cd6afa3bcd09ec',// https://cors.standoffarena.com/https://cosmos-rpc.publicnode.com',
      testMnemonic: process.env.MNEMONIC,
    },
  },
  apollo: {
    clients: {
      default: {
        httpEndpoint: 'https://graphql.mainnet.stargaze-apis.com/graphql',
      },
    },
  },
})
