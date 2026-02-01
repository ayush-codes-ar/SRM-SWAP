import { create } from 'zustand';
import api from '../services/api';

interface Item {
    id: string;
    title: string;
    description: string;
    price: number | null;
    type: string;
    images: string[];
    seller: {
        profile: {
            fullName: string;
        };
        trustScore: number;
    };
    marketplace: string;
    allowHybrid: boolean;
    createdAt: string;
}

interface ItemState {
    items: Item[];
    loading: boolean;
    fetchItems: (filters?: any) => Promise<void>;
    createItem: (data: any) => Promise<void>;
    uploadImages: (files: File[]) => Promise<string[]>;
}

export const useItemStore = create<ItemState>((set) => ({
    items: [],
    loading: false,
    fetchItems: async (filters = {}) => {
        set({ loading: true });
        try {
            const params = new URLSearchParams(filters);
            const res = await api.get(`/items?${params}`);
            set({ items: res.data, loading: false });
        } catch (error) {
            console.error("Backend unreachable, using mock data", error);
            // MOCK DATA FALLBACK
            const mockItems: Item[] = [
                {
                    id: 'mock-item-1',
                    title: 'Gaming Laptop RTX 3060',
                    description: 'Excellent condition, looking for a trade with a tablet or iPad.',
                    price: 45000,
                    type: 'ELECTRONICS',
                    images: ['https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=800'],
                    seller: { profile: { fullName: 'Aryan Sharma' }, trustScore: 920 },
                    marketplace: 'NORMAL',
                    allowHybrid: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'mock-item-2',
                    title: 'Engineering Mechanics Textbook',
                    description: 'Almost new, no highlights. Author: Meriam & Kraige.',
                    price: 800,
                    type: 'BOOKS',
                    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800'],
                    seller: { profile: { fullName: 'Sneha Reddy' }, trustScore: 880 },
                    marketplace: 'NORMAL',
                    allowHybrid: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'mock-item-3',
                    title: 'Noise Cancelling Headphones',
                    description: 'Wireless, 30h battery life. Great for study sessions.',
                    price: 3500,
                    type: 'ACCESSORIES',
                    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'],
                    seller: { profile: { fullName: 'Vikram Singh' }, trustScore: 950 },
                    marketplace: 'NORMAL',
                    allowHybrid: true,
                    createdAt: new Date().toISOString()
                }
            ];
            set({ items: mockItems, loading: false });
        }
    },
    createItem: async (data) => {
        await api.post('/items', data);
    },
    uploadImages: async (files) => {
        const formData = new FormData();
        files.forEach((file) => formData.append('images', file));
        const res = await api.post('/items/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data.urls;
    }
}));
