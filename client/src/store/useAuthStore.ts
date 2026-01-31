import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

interface User {
    id: string;
    email: string;
    role: string;
    trustScore: number;
    isVerified: boolean;
}

interface AuthState {
    user: User | null;
    token: string | null;
    profile: any | null;
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    fetchProfile: () => Promise<void>;
    updateProfile: (data: any) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            profile: null,
            login: async (credentials) => {
                const res = await api.post('/auth/login', credentials);
                set({ user: res.data.user, token: res.data.token });
            },
            register: async (data) => {
                const res = await api.post('/auth/register', data);
                set({ user: res.data.user, token: res.data.token });
            },
            fetchProfile: async () => {
                const res = await api.get('/user/profile');
                set({
                    profile: res.data,
                    user: {
                        ...res.data.user,
                        id: res.data.userId // Prisma returns userId as a field in Profile
                    }
                });
            },
            updateProfile: async (data) => {
                const res = await api.put('/user/profile', data);
                set({ profile: res.data });
            },
            logout: () => set({ user: null, token: null, profile: null }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
