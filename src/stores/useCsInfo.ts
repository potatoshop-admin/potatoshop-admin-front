import { Cs } from '@/types/cs';
import { create } from 'zustand';

interface CsInfoState {
  cs: Cs;
  setCsInfo: (cs: Cs) => void;
}

export const useCsInfo = create<CsInfoState>((set) => ({
  cs: {
    csId: 0,
    storeId: 0,
    userId: 0,
    ordersId: 0,
    question: '',
    answer: '',
    csStatus: 'WAITING',
    createdAt: '',
  },
  setCsInfo: (cs: Cs) => set({ cs }),
}));
