import { SetMetadata } from '@nestjs/common';

// Metadata key for permissions
export const PERMISSION_KEY = 'permission';

// Decorator to set required module and action
export const Permission = (module: string, action: string) =>
  SetMetadata(PERMISSION_KEY, { module, action });
