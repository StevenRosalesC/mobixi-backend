export interface JwtPayload {
  sub: string;
  email: string;
  role: 'SUPER_ADMIN' | 'STORE_ADMIN' | 'USER';
  storeId?: string;
  permissions?: Record<string, string[]>;
}
