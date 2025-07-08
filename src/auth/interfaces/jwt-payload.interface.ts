export interface JwtPayload {
  id: string;
  email: string;
  type: 'user' | 'admin';
  role?: string;
  permissions?: Record<string, string[]>;
}
