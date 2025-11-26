export interface AdminUser {
  adminUserId: number;
  storeId: number;
  name: string;
  logInId: string;
  role: RoleType;
  password: string;
}

export type RoleType = 'MASTER' | 'MANAGER' | 'STAFF';
