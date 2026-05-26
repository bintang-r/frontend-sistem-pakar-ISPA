import { create } from 'zustand';

interface User {
    id: number;
    username: string;
    email: string;
    full_name: string;
    role: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    login: (user, token) => {
        localStorage.setItem('access_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, isAuthenticated: true });
    },
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        set({ user: null, isAuthenticated: false });
    },
    checkAuth: () => {
        const token = localStorage.getItem('access_token');
        const user = localStorage.getItem('user');
        if (token && user) {
            set({ user: JSON.parse(user), isAuthenticated: true });
        }
    }
}));
