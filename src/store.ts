import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Auth store interface and implementation
interface AuthState {
  accessToken: string | null;
  expiresIn: number | null;
  setToken: (token: string, expires: number) => void;
  clearToken: () => void;
}

// Theme store interface and implementation
interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
}

// Auth store using localStorage
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      expiresIn: null,
      setToken: (token, expires) => set({ accessToken: token, expiresIn: expires }),
      clearToken: () => set({ accessToken: null, expiresIn: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Theme store using localStorage
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);