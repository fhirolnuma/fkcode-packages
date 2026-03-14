import { addImports, addRouteMiddleware, createResolver, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@fkcode/nuxt-auth',
    configKey: 'fkcodeAuth',
  },
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    addImports([
      { name: 'useAuth', as: 'useAuth', from: resolver.resolve('./composables/useAuth') },
    ])

    addRouteMiddleware({
      name: 'auth',
      path: resolver.resolve('./middleware/auth'),
    })
  },
})
