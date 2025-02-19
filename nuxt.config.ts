export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/icon", '@pinia/nuxt'],

  app: {
    head: {
      title: 'ThreadCity', // Titre principal de l'application
      meta: [
        { name: 'description', content: 'ThreadCity est un city builder innovant où chaque bâtiment est une icône interactive.' },
        { property: 'og:title', content: 'ThreadCity' },
        { property: 'og:description', content: 'Créez et gérez votre ville en utilisant un système unique basé sur des icônes.' },
        { property: 'og:url', content: 'https://threadcity.vercel.app' }, // Remplace par l'URL réelle
        { property: 'og:type', content: 'website' },
        { name: 'keywords', content: 'city builder, icônes, gestion, simulation, stratégie, Nuxt 3' },
        { name: 'author', content: 'ThreadCity Team' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }, // Favicon
      ]
    }
  }
})
