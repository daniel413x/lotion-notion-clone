import { create } from 'zustand';

interface UseCoverImageModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onReplace: (str: string) => void;
  coverImageReplacementUrl?: string;
}

const useCoverImageModal = create<UseCoverImageModalStore>((set) => ({
  coverImage: undefined,
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false, coverImageReplacementUrl: undefined }),
  onReplace: (url: string) => set({ coverImageReplacementUrl: url, isOpen: true }),
}));

export default useCoverImageModal;
