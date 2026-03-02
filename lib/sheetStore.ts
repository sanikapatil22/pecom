import { create } from 'zustand';

// Define the type for the store's state and actions
interface SheetStore {
  isOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  toggleSheet: () => void;
}

// Create the store with TypeScript types
export const useSheetStore = create<SheetStore>((set) => ({
  isOpen: false, // Initial state: sheet is closed
  openSheet: () => set({ isOpen: true }), // Action to open the sheet
  closeSheet: () => set({ isOpen: false }), // Action to close the sheet
  toggleSheet: () => set((state) => ({ isOpen: !state.isOpen })), // Action to toggle the sheet
}));

export default useSheetStore;
