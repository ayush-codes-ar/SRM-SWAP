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
            console.error("Failed to fetch items", error);
            set({ loading: false });
        }
    },
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
