import { computed, useState, useCookie } from '#imports'

type User = { id: number; name: string; email: string } | null

export function useAuth() {
  const user = useState<User>('auth:user', () => null)
  const loggedIn = computed(() => !!user.value)

  async function fetchCsrf() {
    if (import.meta.server) return

    await $fetch('/sanctum/csrf-cookie', {
      credentials: 'include',
    })
  }

  function getXsrfTokenHeader() {
    const xsrf = useCookie('XSRF-TOKEN')
    return xsrf.value
      ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrf.value) }
      : {}
  }

  async function me(force = false) {
    if (import.meta.server) return null

    if (!force && user.value) return user.value

    try {
      const data = await $fetch<User>('/api/me', {
        credentials: 'include',
        headers: { Accept: 'application/json' },
      })

      user.value = data ?? null
      return user.value
    } catch {
      user.value = null
      return null
    }
  }

  async function login(email: string, password: string) {
    await fetchCsrf()

    await $fetch('/api/login', {
      method: 'POST',
      body: { email, password },
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...getXsrfTokenHeader(),
      },
    })

    await me(true)
  }

  async function logout() {
    await fetchCsrf()

    await $fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...getXsrfTokenHeader(),
      },
    })

    user.value = null
  }

  return { user, loggedIn, me, login, logout }
}
