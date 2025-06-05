import styles from './Login.module.css'
import { useState } from 'react'
import { useAuth } from '@/hooks/auth/useAuth'
import { useNavigate } from 'react-router-dom'
import EyeOpen from '@/components/icons/EyeOpen.jsx'
import EyeClosed from '@/components/icons/EyeClosed.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, error } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    login({ email, password }, () => {
      navigate('/Chat')
    })
  }

  return (
    <div className={styles['login-container']}>
      <form onSubmit={handleSubmit} className={styles['login-form']}>
        <img
          src="/logochat.png"
          alt="Logo"
          className={styles['login-logo']}
        />
        <hr style={{ marginBottom: '1rem' }} />

        <div className={styles['input-container']}>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Introduce tu email"
            required
          />
          <label htmlFor="email">Email</label>
        </div>

        <div className={styles['input-container']}>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Introduce tu contraseña"
            required
          />
          <label htmlFor="password">Contraseña</label>
          <span
            className={styles['toggle-password']}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOpen className={styles['icono-ojo-abierto']} />
            ) : (
              <EyeClosed className={styles['icono-ojo-cerrado']} />
            )}
          </span>
        </div>

        <button type="submit" className={styles['login-button']}>
          Iniciar sesión
        </button>

        {/* Mostrar error si existe */}
        {error && <p className={styles['error-message']}>{error}</p>}
      </form>
    </div>
  )
}
