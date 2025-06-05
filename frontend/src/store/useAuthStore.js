import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,  // Solo info básica del usuario

  setUser: (user) => {
    if (!user) {
      localStorage.removeItem('user');
      set({ user: null });
      return;
    }
    const { id, email } = user;
    localStorage.setItem('user', JSON.stringify({ id, email }));
    set({ user: { id, email } });
  },

  logout: () => {
    localStorage.removeItem('user');
    set({ user: null });
    // Para logout, además llama al endpoint backend para limpiar la cookie
  },
}));

export default useAuthStore;
