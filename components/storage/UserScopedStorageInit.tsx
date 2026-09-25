'use client';

import { useEffect } from 'react';
import { initUserScopedStorage } from '@/lib/storage/userScopedStorage';

export function UserScopedStorageInit() {
  useEffect(() => {
    initUserScopedStorage();
  }, []);

  return null;
}
