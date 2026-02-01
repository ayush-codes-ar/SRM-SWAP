import { create } from 'zustand';

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
        console.log('MOCK: Socket connection established');
    },
    startTrade: async (listingId) => {
        console.log('MOCK: Starting trade for', listingId);
        return 'mock-trade-456';
    },
    fetchTrade: async (tradeId) => {
        set({ loading: true });
        console.log('MOCK: Fetching trade', tradeId);
        // MOCK TRADE
        const mockTrade: Trade = {
            id: tradeId,
            status: 'NEGOTIATING',
            listing: {
                title: 'Gaming Laptop RTX 3060',
                description: 'Excellent condition',
                sellerId: 'mock-seller-789',
                seller: { profile: { fullName: 'Aryan Sharma' }, trustScore: 920 },
                price: 45000,
                type: 'ELECTRONICS',
                images: ['https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=800'],
                allowHybrid: true
            },
            buyerId: 'mock-user-123',
            buyer: { profile: { fullName: 'Demo Inhabitant' }, trustScore: 500 },
            messages: [
                {
                    senderId: 'mock-seller-789',
                    sender: { profile: { fullName: 'Aryan Sharma' } },
                    content: 'Hi! I saw you are interested in the laptop. What is your offer?',
                    createdAt: new Date(Date.now() - 3600000).toISOString()
                },
                {
                    senderId: 'mock-user-123',
                    sender: { profile: { fullName: 'Demo Inhabitant' } },
                    content: 'Hey Aryan! I have an iPad Pro and can add some cash. Interested?',
                    createdAt: new Date(Date.now() - 1800000).toISOString()
                }
            ]
        };
        set({ activeTrade: mockTrade, loading: false });
    },
    fetchIssues: async (status) => {
        console.log('MOCK: Fetching issues', status);
        set({ issues: [] });
    },
    sendMessage: async (_tradeId, senderId, content) => {
        console.log('MOCK: Sending message', content);
        const { activeTrade } = get();
        if (activeTrade) {
            const newMessage: Message = {
                senderId,
                sender: { profile: { fullName: senderId === 'mock-user-123' ? 'Demo Inhabitant' : 'Aryan Sharma' } },
                content,
                createdAt: new Date().toISOString()
            };
            set({ activeTrade: { ...activeTrade, messages: [...activeTrade.messages, newMessage] } });
        }
    },
    proposeDeal: async (_tradeId, terms) => {
        console.log('MOCK: Proposing deal', terms);
        const { activeTrade } = get();
        if (activeTrade) {
            set({
                activeTrade: {
                    ...activeTrade,
                    status: 'PROPOSED',
                    moneyProposal: terms.money,
                    barterProposal: terms.barter,
                    commitmentProposal: terms.commitment
                }
            });
        }
    },
    acceptDeal: async (_tradeId) => {
        console.log('MOCK: Accepting deal', _tradeId);
        const { activeTrade } = get();
        if (activeTrade) {
            set({ activeTrade: { ...activeTrade, status: 'ACCEPTED' } });
        }
    },
    declineDeal: async (_tradeId) => {
        console.log('MOCK: Declining deal', _tradeId);
        const { activeTrade } = get();
        if (activeTrade) {
            set({ activeTrade: { ...activeTrade, status: 'NEGOTIATING' } });
        }
    },
    markDone: async (_id) => {
        console.log('MOCK: Mark done', _id);
    },
    finishTrade: async (_id) => {
        console.log('MOCK: Finish trade', _id);
        const { activeTrade } = get();
        if (activeTrade) {
            set({ activeTrade: { ...activeTrade, status: 'COMPLETED' } });
        }
    },
    reportIssue: async (_tradeId, description) => {
        console.log('MOCK: Report issue', description);
        set({ activeTrade: { ...get().activeTrade!, status: 'UNDER_REVIEW' } });
    },
    disconnectSocket: () => {
        console.log('MOCK: Socket disconnected');
    }
}));
