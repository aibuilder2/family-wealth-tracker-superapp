'use client';

// Unscoped keys that apply globally across all accounts on this browser
const UNSCOPED_KEYS = new Set([
  'fwa_active_user',
  'fwa_known_users',
  'fwa_auth_mode',
]);

let isStoragePatched = false;

let origGetItem: ((key: string) => string | null) | null = null;
let origSetItem: ((key: string, value: string) => void) | null = null;
let origRemoveItem: ((key: string) => void) | null = null;
let origClear: (() => void) | null = null;

/**
 * Returns the currently logged in user identifier (lowercase email, phone, or 'guest').
 */
export function getActiveUser(): string {
  if (typeof window === 'undefined') return 'guest';
  try {
    const getter = origGetItem || window.localStorage.getItem.bind(window.localStorage);
    const raw = getter.call(window.localStorage, 'fwa_active_user');
    return raw && raw.trim() ? raw.trim().toLowerCase() : 'guest';
  } catch (e) {
    return 'guest';
  }
}

/**
 * Sets the active user and records them in the known users list for easy switching.
 */
export function setActiveUser(user: string) {
  if (typeof window === 'undefined') return;
  const clean = user.trim().toLowerCase();
  if (!clean) return;

  try {
    const setter = origSetItem || window.localStorage.setItem.bind(window.localStorage);
    const getter = origGetItem || window.localStorage.getItem.bind(window.localStorage);

    setter.call(window.localStorage, 'fwa_active_user', clean);

    // Track known accounts for account switcher
    if (clean !== 'guest') {
      const existingRaw = getter.call(window.localStorage, 'fwa_known_users');
      let known: string[] = [];
      if (existingRaw) {
        try {
          known = JSON.parse(existingRaw);
        } catch (e) {}
      }
      if (!Array.isArray(known)) known = [];
      if (!known.includes(clean)) {
        known.push(clean);
        setter.call(window.localStorage, 'fwa_known_users', JSON.stringify(known));
      }
    }
  } catch (e) {
    console.error('Failed to set active user:', e);
  }
}

/**
 * Returns the list of previously logged in accounts on this device.
 */
export function getKnownUsers(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const getter = origGetItem || window.localStorage.getItem.bind(window.localStorage);
    const raw = getter.call(window.localStorage, 'fwa_known_users');
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

/**
 * Removes a user from the known accounts list.
 */
export function removeKnownUser(user: string) {
  if (typeof window === 'undefined') return;
  const clean = user.trim().toLowerCase();
  try {
    const getter = origGetItem || window.localStorage.getItem.bind(window.localStorage);
    const setter = origSetItem || window.localStorage.setItem.bind(window.localStorage);
    const existingRaw = getter.call(window.localStorage, 'fwa_known_users');
    if (existingRaw) {
      const list = JSON.parse(existingRaw);
      if (Array.isArray(list)) {
        const filtered = list.filter((u: string) => u !== clean);
        setter.call(window.localStorage, 'fwa_known_users', JSON.stringify(filtered));
      }
    }
  } catch (e) {}
}

/**
 * Logs out the active user, setting active session to 'guest'.
 */
export function logoutUser() {
  if (typeof window === 'undefined') return;
  try {
    const setter = origSetItem || window.localStorage.setItem.bind(window.localStorage);
    setter.call(window.localStorage, 'fwa_active_user', 'guest');
  } catch (e) {}
}

/**
 * Resolves a storage key to be scoped by the current active user.
 * e.g. 'fwa_transactions' -> 'fwa_u_rajesh@gmail.com__fwa_transactions'
 */
export function resolveUserScopedKey(key: string): string {
  if (typeof key !== 'string') return key;
  if (!key.startsWith('fwa_')) return key;
  if (UNSCOPED_KEYS.has(key)) return key;
  if (key.startsWith('fwa_u_')) return key; // already scoped

  const activeUser = getActiveUser();
  return `fwa_u_${activeUser}__${key}`;
}

/**
 * Seamlessly transparent wrapper over localStorage to ensure 100% user data isolation.
 * Any component reading/writing 'fwa_...' automatically gets scoped to the active user!
 */
export function initUserScopedStorage() {
  if (typeof window === 'undefined') return;
  if (isStoragePatched) return;

  try {
    const storageProto = Storage.prototype;
    origGetItem = storageProto.getItem;
    origSetItem = storageProto.setItem;
    origRemoveItem = storageProto.removeItem;
    origClear = storageProto.clear;

    // Attach to localStorage for direct access
    (window.localStorage as any).__origGetItem = origGetItem;
    (window.localStorage as any).__origSetItem = origSetItem;
    (window.localStorage as any).__origRemoveItem = origRemoveItem;

    storageProto.getItem = function (key: string) {
      const targetKey = resolveUserScopedKey(key);
      const val = origGetItem!.call(this, targetKey);
      if (val !== null) return val;

      // Fallback: If scoped key doesn't have data yet, check legacy un-scoped key
      // so user's previously created family and records are safely preserved!
      if (targetKey !== key) {
        let legacyVal = origGetItem!.call(this, key);
        // Also handle fwa_family_profile vs fwa_family alias
        if (legacyVal === null && key === 'fwa_family_profile') {
          legacyVal = origGetItem!.call(this, 'fwa_family') || origGetItem!.call(this, `fwa_u_${getActiveUser()}__fwa_family`);
        }
        if (legacyVal !== null) {
          try {
            origSetItem!.call(this, targetKey, legacyVal);
          } catch (e) {}
          return legacyVal;
        }
      }
      return null;
    };

    storageProto.setItem = function (key: string, value: string) {
      const targetKey = resolveUserScopedKey(key);
      return origSetItem!.call(this, targetKey, value);
    };

    storageProto.removeItem = function (key: string) {
      const targetKey = resolveUserScopedKey(key);
      return origRemoveItem!.call(this, targetKey);
    };

    storageProto.clear = function () {
      const activeUser = getActiveUser();
      const prefix = `fwa_u_${activeUser}__`;
      const keysToRemove: string[] = [];
      for (let i = 0; i < this.length; i++) {
        const k = this.key(i);
        if (k && k.startsWith(prefix)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => origRemoveItem!.call(this, k));
    };

    isStoragePatched = true;
  } catch (err) {
    console.warn('Could not initialize userScopedStorage patch:', err);
  }
}

// Auto-run if running client-side
if (typeof window !== 'undefined') {
  initUserScopedStorage();
}
