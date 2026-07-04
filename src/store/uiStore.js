import { create } from 'zustand';

export const useUIStore = create((set) => ({
    activeTab: 'available', // 'available' or 'my'
    selectedCity: 'All',

    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedCity: (city) => set({ selectedCity: city }),
}));
