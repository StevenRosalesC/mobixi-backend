import { SetMetadata } from '@nestjs/common';

export const STORE_REQUIRED_KEY = 'storeRequired';
export const StoreRequired = () => SetMetadata(STORE_REQUIRED_KEY, true);
