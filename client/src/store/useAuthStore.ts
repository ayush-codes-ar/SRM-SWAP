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
                // MOCK LOGIN
                const dummyUser = {
                    id: 'mock-user-123',
                    email: credentials.identifier || 'demo@srmap.edu.in',
                    role: credentials.role || 'STUDENT',
                    trustScore: 850,
                    isVerified: true
                };
                set({ user: dummyUser, token: 'mock-token-abc' });
            },
            register: async (data) => {
                // MOCK REGISTER
                const dummyUser = {
                    id: 'mock-user-123',
                    email: data.email,
                    role: 'STUDENT',
                    trustScore: 500,
                    isVerified: false
                };
                set({ user: dummyUser, token: 'mock-token-abc' });
            },
            fetchProfile: async () => {
                // MOCK PROFILE FETCH
                const { user } = get();
                if (!user) return;
                set({
                    profile: {
                        userId: user.id,
                        fullName: 'Demo Inhabitant',
                        regNumber: 'AP21110010001',
                        phone: '+91 99999 88888',
                        hostelDetails: 'Demo Hostel, Room 404',
                        user: user
                    }
                });
            },
            updateProfile: async (data) => {
                // MOCK PROFILE UPDATE
                const { profile } = get();
                set({ profile: { ...profile, ...data } });
            },
            logout: () => set({ user: null, token: null, profile: null }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
