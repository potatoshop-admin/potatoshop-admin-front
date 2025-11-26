export interface Cs {
  csId: number;
  storeId: number;
  userId: number;
  ordersId: number;
  question: string;
  answer: string;
  csStatus: CsStatus;
  createdAt: string;
}

export type CsStatus = 'WAITING' | 'ANSWERED';
