import { useState, useCallback } from 'react'
import { login as loginService } from '@/services/auth/authService'
import useAuthStore from '@/store/useAuthStore'
import { logout as logoutService } from '@/services/auth/authService'
import { useNavigate } from 'react-router-dom'
import { useLoaderStore } from '@/store/useLoader.store.js'

export function useAuth() {
  const [error, setError] = useState(null)
  const setUser = useAuthStore((state) => state.setUser)
  const navigate = useNavigate()
  const { startLoading, stopLoading } = useLoaderStore()

  const login = useCallback(
    async ({ email, password }, onSuccess) => {
      startLoading()
      setError(null) // Limpiar cualquier error previo

      try {
        const res = await loginService(email, password)

        // Guardamos solo id, email y token
        const { user } = res.data
        setUser({ id: user.id, email: user.email }) // Guardamos solo los datos necesarios

        if (onSuccess) onSuccess(res.data)
      } catch (err) {
        setError('Email o contraseña incorrecta.')
      } finally {
        stopLoading()
      }
    },
    [setUser]
  )

  const logout = useCallback(async () => {
    startLoading()
    try {
      await logoutService()
      setUser(null)
      navigate('/')
    } catch (err) {
      // console.error("Error al cerrar sesión:", err);
      setError('Error al cerrar sesión.')
    } finally {
      stopLoading()
    }
  }, [setUser, navigate])

  return {
    login,
    logout,
    error,
  }
}
