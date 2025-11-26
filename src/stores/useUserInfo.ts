import { create } from 'zustand';
import { User } from '@/types/user';

interface UserInfoState {
  user: User;
  setUserInfo: (user: User) => void;
}

export const useUserInfo = create<UserInfoState>((set) => ({
  user: {
    age: null,
    birthday: null,
    createdAt: '',
    email: '',
    grade: 'BASIC',
    logInId: '',
    name: '',
    password: '',
    storeId: 0,
    userId: 0,
  },
  setUserInfo: (user: User) => set({ user }),
}));
