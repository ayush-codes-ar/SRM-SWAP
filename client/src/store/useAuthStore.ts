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
        (set, get) => ({
            user: null,
            token: null,
            profile: null,
            login: async (credentials) => {
                login: async (credentials) => {
                    const { data } = await api.post('/auth/login', credentials);
                    set({ user: data.user, token: data.token });
                },
                    register: async (data) => {
                        register: async (registerData) => {
                            const { data } = await api.post('/auth/register', registerData);
                            set({ user: data.user, token: data.token });
                        },
                            fetchProfile: async () => {
                                fetchProfile: async () => {
                                    try {
                                        const { data } = await api.get('/user/profile');
                                        set({ profile: data });
                                    } catch (error) {
                                        console.error('Failed to fetch profile', error);
                                    }
                                },
                                    updateProfile: async (data) => {
                                        updateProfile: async (updateData) => {
                                            const { data } = await api.put('/user/profile', updateData);
                                            set({ profile: data });
                                        },
                                            logout: () => set({ user: null, token: null, profile: null }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
