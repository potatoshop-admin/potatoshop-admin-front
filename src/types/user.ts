export type Grade = 'BASIC' | 'BLACK' | 'VIP';

export interface User {
  age: number | null;
  birthday: string | null;
  createdAt: string;
  email: string;
  grade: Grade;
  logInId: string;
  name: string;
  password: string;
  storeId: number;
  userId: number;
}
