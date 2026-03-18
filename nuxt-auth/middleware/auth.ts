import { defineNuxtRouteMiddleware, navigateTo } from '#imports'
import { useAuth } from '../composables/useAuth'

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const { me } = useAuth()

  const user = await me(true)

  if (!user) {
    return navigateTo('/login')
  }
})
