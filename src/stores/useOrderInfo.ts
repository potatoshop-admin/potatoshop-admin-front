import { create } from 'zustand';
import { Order } from '@/types/order';

interface OrderInfoState {
  order: Order;
  setOrderInfo: (order: Order) => void;
}

export const useOrderInfo = create<OrderInfoState>((set) => ({
  order: {
    storeId: 0,
    ordersId: 0,
    orderItems: [],
    orderStatus: 'PAID',
    user: {
      userId: 0,
      name: '',
      age: 0,
      grade: 'BASIC',
    },
    address: '',
    totalPrice: 0,
    createdAt: '',
  },
  setOrderInfo: (order: Order) => set({ order }),
}));
