import { create } from 'zustand';
import { io } from 'socket.io-client';
import api from '../services/api';

interface Trade {
    id: string;
    status: string;
    listing: {
        title: string;
        description: string;
        sellerId: string;
        seller: { profile: { fullName: string }, trustScore: number };
        price: number | null;
        type: string;
        images: string[];
        allowHybrid?: boolean;
    };
    buyerId: string;
    buyer: {
        profile: { fullName: string };
        trustScore: number;
    };
    location?: string | null;
    scheduledAt?: string | null;

    // Proposal fields
    moneyProposal?: number | null;
    barterProposal?: string | null;
    commitmentProposal?: string | null;
    proposerId?: string | null;
    supervisorNote?: string | null;
    supervisorConfirmed?: boolean;
    buyerFinished?: boolean;
    sellerFinished?: boolean;

    messages: Message[];
}

interface Message {
    senderId: string;
    sender: { profile: { fullName: string } };
    content: string;
    createdAt: string;
}

interface TradeState {
    socket: any | null; // Keep socket in state for proper management
    activeTrade: Trade | null;
    trades: Trade[]; // List of user's trades
    issues: any[]; // New: List of issues
    loading: boolean; // New: Loading state

    connectSocket: () => void;
    startTrade: (listingId: string) => Promise<string>; // Keep startTrade as it's not explicitly removed
    fetchTrade: (tradeId: string) => Promise<void>;
    fetchIssues: (status: string) => Promise<void>; // New: Fetch issues
    sendMessage: (tradeId: string, senderId: string, content: string) => Promise<void>; // Updated signature
    proposeDeal: (tradeId: string, terms: { money?: number, barter?: string, commitment?: string }) => Promise<void>; // Updated signature
    acceptDeal: (tradeId: string) => Promise<void>;
    declineDeal: (tradeId: string) => Promise<void>;
    markDone: (tradeId: string) => Promise<void>; // New: Mark trade as done
    finishTrade: (tradeId: string) => Promise<void>; // New: Finish trade
    reportIssue: (tradeId: string, description: string) => Promise<void>; // New: Report issue
    disconnectSocket: () => void;
}

export const useTradeStore = create<TradeState>((set, get) => ({
    socket: null,
    activeTrade: null,
    trades: [],
    issues: [], // Initialize new state
    loading: false, // Initialize new state

    connectSocket: () => {
        const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        socket.on('connect', () => {
            console.log('Socket connected');
        });

        socket.on('message', (message: Message) => {
            const { activeTrade } = get();
            if (activeTrade) {
                set({ activeTrade: { ...activeTrade, messages: [...activeTrade.messages, message] } });
            }
        });

        set({ socket });
    },
    startTrade: async (listingId) => {
        const { data } = await api.post('/trades', { listingId });
        return data.id;
    },
    fetchTrade: async (tradeId) => {
        set({ loading: true });
        try {
            const { data } = await api.get(`/trades/${tradeId}`);
            set({ activeTrade: data, loading: false });

            // Join socket room
            const { socket } = get();
            if (socket) {
                socket.emit('joinTrade', tradeId);
            }
        } catch (error) {
            console.error('Failed to fetch trade', error);
            set({ loading: false });
        }
    },
    fetchIssues: async (status) => {
        console.log('MOCK: Fetching issues', status);
        set({ issues: [] });
    },
    sendMessage: async (tradeId, senderId, content) => {
        const { socket } = get();
        if (socket) {
            socket.emit('sendMessage', { tradeId, senderId, content });
        }
    },
    proposeDeal: async (tradeId, terms) => {
        await api.post(`/trades/${tradeId}/propose`, terms);
        get().fetchTrade(tradeId);
    },
    acceptDeal: async (tradeId) => {
        await api.post(`/trades/${tradeId}/accept`);
        get().fetchTrade(tradeId);
    },
    declineDeal: async (tradeId) => {
        await api.post(`/trades/${tradeId}/decline`);
        get().fetchTrade(tradeId);
    },
    markDone: async (tradeId) => {
        await api.post(`/trades/${tradeId}/mark-done`);
        get().fetchTrade(tradeId);
    },
    finishTrade: async (tradeId) => {
        await api.post(`/trades/${tradeId}/finish`);
        get().fetchTrade(tradeId);
    },
    reportIssue: async (tradeId, description) => {
        await api.post(`/trades/${tradeId}/report-issue`, { description });
        get().fetchTrade(tradeId);
    },
    disconnectSocket: () => {
        const { socket } = get();
        if (socket) socket.disconnect();
        set({ socket: null });
    }
}));
