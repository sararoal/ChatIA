import { Popover } from 'radix-ui'
import styles from './Sidebar.module.css'
import Perfil from '@/components/icons/Perfil.jsx'
import Logout from '@/components/icons/Logout.jsx'
import { useAuth } from '@/hooks/auth/useAuth'

const Sidebar = () => {
  const { logout, isLoading } = useAuth()

  return (
    <aside className={styles.sidebar}>
      <div className={styles['sidebar-logo']}>
        <img
          src="/logo.png"
          alt="Logo"
          className={styles['logo-img']}
        />
      </div>

      <div className={styles['footer']}>
        <Popover.Root>
          <Popover.Trigger>
            <div className="h-full flex items-center cursor-pointer">
              <div className="flex items-center justify-center  transition-opacity ease">
                <Perfil />
              </div>
            </div>
          </Popover.Trigger>
          <Popover.Content
            side="top"
            align="start"
            sideOffset={20}
            className="divide-y divide-white/5 rounded-xl bg-charcoal-600 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0"
          >
            <div className="p-2">
              <button
                onClick={logout}
                disabled={isLoading}
                className="w-32 flex items-center gap-2 rounded-md px-2 py-1 text-sm text-ghost-100 hover:bg-ghost-100/20 transition-colors duration-150"
              >
                <Logout className="h-4 w-4 mr-2" />
                <span className="span-sm">{isLoading ? 'Saliendo...' : 'Salir'}</span>
              </button>
            </div>
          </Popover.Content>
        </Popover.Root>
      </div>
    </aside>
  )
}

export default Sidebar