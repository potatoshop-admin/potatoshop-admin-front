import { create } from 'zustand';
import { RoleType } from '@/types/adminUser';

interface LogInUser {
  name: string;
  id: string;
  role: RoleType;
}

interface LogInUserState {
  logInUser: LogInUser;
  setLogInUser: (logInUser: LogInUser) => void;
  deleteLogInUser: () => void;
}

export const useLogInUser = create<LogInUserState>((set) => ({
  logInUser: {
    name: '',
    id: '',
    role: 'STAFF',
  },
  setLogInUser: (logInUser) => set({ logInUser }),
  deleteLogInUser: () => set({ logInUser: { name: '', id: '', role: 'STAFF' } }),
}));
