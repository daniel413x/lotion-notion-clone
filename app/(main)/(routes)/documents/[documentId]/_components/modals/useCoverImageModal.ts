import { create } from 'zustand';

interface UseCoverImageModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useCoverImageModal = create<UseCoverImageModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useCoverImageModal;
