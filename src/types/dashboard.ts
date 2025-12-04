import { Category } from '@/types/item';

export interface Categories {
  category: Category;
  totalSales: number;
}

export interface DailyCategorySales {
  date: string;
  categories: Categories[];
}

export interface UserDailyStatus {
  date: string;
  totalUSers: number;
  newUsers: number;
}

export interface Dashboard {
  monthlySalesAmount: number;
  totalCustomers: number;
  totalOrders: number;
  pendingDelivery: number;
  shippingCount: number;
  deliveredCount: number;
  totalCsCount: number;
  answeredCsCount: number;
  categoryTotalSale: Categories[];
  dailyCategorySales: DailyCategorySales[];
  userDailyStatus: UserDailyStatus[];
}
