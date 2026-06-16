'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, Salon } from '@/types/auth';

type AuthStore = {
  token: string | null;
  user: User | null;
  salon: Salon | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  setAuth: (token: string, user: User, salon: Salon | null) => void;
  clearAuth: () => void;
  setSalon: (salon: Salon) => void;
  setHydrated: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      salon: null,
      isAuthenticated: false,
      isHydrated: false,

      setAuth: (token, user, salon) =>
        set({
          token,
          user,
          salon,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          token: null,
          user: null,
          salon: null,
          isAuthenticated: false,
        }),

      setSalon: (salon) => set({ salon }),

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'agendabeleza-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        salon: state.salon,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);