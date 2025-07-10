import { JsonValue } from '@prisma/client/runtime/library';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  permissions: JsonValue;
  storeId?: string;
  storeIds?: string[];
}
