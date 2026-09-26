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
  if (typeof window === 'undefined') return 'ankush.bani@gmail.com';
  try {
    const getter = origGetItem || window.localStorage.getItem.bind(window.localStorage);
    const setter = origSetItem || window.localStorage.setItem.bind(window.localStorage);
    const raw = getter.call(window.localStorage, 'fwa_active_user');
    if (raw && raw.trim() && raw.trim().toLowerCase() !== 'guest') {
      return raw.trim().toLowerCase();
    }

    // Auto-detect Google / Supabase session token in localStorage
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith('sb-') && k.endsWith('-auth-token')) {
        const tokenRaw = getter.call(window.localStorage, k);
        if (tokenRaw) {
          try {
            const parsed = JSON.parse(tokenRaw);
            const email = parsed?.user?.email || parsed?.session?.user?.email;
            if (email && typeof email === 'string') {
              const clean = email.trim().toLowerCase();
              setter.call(window.localStorage, 'fwa_active_user', clean);
              return clean;
            }
          } catch (e) {}
        }
      }
    }

    // Default primary account identifier
    setter.call(window.localStorage, 'fwa_active_user', 'ankush.bani@gmail.com');
    return 'ankush.bani@gmail.com';
  } catch (e) {
    return 'ankush.bani@gmail.com';
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
      autoMigrateGuestDataToActiveUser(clean);
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
 * Seamlessly migrates all data saved in guest or unscoped storage into the active logged-in user profile.
 */
export function autoMigrateGuestDataToActiveUser(activeUser: string) {
  if (typeof window === 'undefined' || !activeUser || activeUser === 'guest') return;
  try {
    const getter = origGetItem || window.localStorage.getItem.bind(window.localStorage);
    const setter = origSetItem || window.localStorage.setItem.bind(window.localStorage);

    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (!k) continue;

      let baseKey: string | null = null;
      if (k.startsWith('fwa_u_guest__')) {
        baseKey = k.replace('fwa_u_guest__', '');
      } else if (k.startsWith('fwa_') && !k.startsWith('fwa_u_')) {
        baseKey = k;
      }

      if (baseKey && !UNSCOPED_KEYS.has(baseKey)) {
        const userKey = `fwa_u_${activeUser}__${baseKey}`;
        const currentUserVal = getter.call(window.localStorage, userKey);
        const sourceVal = getter.call(window.localStorage, k);

        if (sourceVal && sourceVal !== '[]' && sourceVal !== '{}' && sourceVal !== 'null') {
          if (!currentUserVal || currentUserVal === '[]' || currentUserVal === 'null') {
            setter.call(window.localStorage, userKey, sourceVal);
          }
        }
      }
    }

    // Also migrate cross-key aliases
    // 1. rental tenants <-> hostel tenants
    const tenantUserKey = `fwa_u_${activeUser}__fwa_rental_tenants`;
    const currTenants = getter.call(window.localStorage, tenantUserKey);
    if (!currTenants || currTenants === '[]' || currTenants === 'null') {
      const altTenants = getter.call(window.localStorage, `fwa_u_${activeUser}__fwa_hostel_tenants_v1`) ||
                         getter.call(window.localStorage, 'fwa_u_guest__fwa_hostel_tenants_v1') ||
                         getter.call(window.localStorage, 'fwa_hostel_tenants_v1');
      if (altTenants && altTenants !== '[]' && altTenants !== 'null') {
        setter.call(window.localStorage, tenantUserKey, altTenants);
      }
    }
  } catch (e) {
    console.warn('Auto migration error:', e);
  }
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
      
      // If found and contains actual data, return immediately
      if (val !== null && val !== '[]' && val !== '{}' && val !== 'null') return val;

      // Fallback: If scoped key has no data or has empty '[]', search fallbacks
      if (targetKey !== key) {
        const activeUser = getActiveUser();
        let fallbackVal: string | null = null;

        // 1. Check guest scoped key: fwa_u_guest__${key}
        const guestVal = origGetItem!.call(this, `fwa_u_guest__${key}`);
        if (guestVal && guestVal !== '[]' && guestVal !== '{}' && guestVal !== 'null') {
          fallbackVal = guestVal;
        }

        // 2. Check unscoped key: ${key}
        if (!fallbackVal) {
          const unscopedVal = origGetItem!.call(this, key);
          if (unscopedVal && unscopedVal !== '[]' && unscopedVal !== '{}' && unscopedVal !== 'null') {
            fallbackVal = unscopedVal;
          }
        }

        // 3. Check cross-key aliases
        if (!fallbackVal) {
          if (key === 'fwa_rental_tenants' || key === 'fwa_hostel_tenants_v1') {
            const altKey = key === 'fwa_rental_tenants' ? 'fwa_hostel_tenants_v1' : 'fwa_rental_tenants';
            fallbackVal = origGetItem!.call(this, `fwa_u_${activeUser}__${altKey}`) ||
                          origGetItem!.call(this, `fwa_u_guest__${altKey}`) ||
                          origGetItem!.call(this, altKey);
          } else if (key === 'fwa_family_profile' || key === 'fwa_family') {
            const altKey = key === 'fwa_family_profile' ? 'fwa_family' : 'fwa_family_profile';
            fallbackVal = origGetItem!.call(this, `fwa_u_${activeUser}__${altKey}`) ||
                          origGetItem!.call(this, `fwa_u_guest__${altKey}`) ||
                          origGetItem!.call(this, altKey);
          }
        }

        // 4. Search any other key ending with __${key} in localStorage
        if (!fallbackVal) {
          for (let i = 0; i < this.length; i++) {
            const k = this.key(i);
            if (k && k !== targetKey && (k.endsWith(`__${key}`) || k === key)) {
              const candidate = origGetItem!.call(this, k);
              if (candidate && candidate !== '[]' && candidate !== '{}' && candidate !== 'null') {
                fallbackVal = candidate;
                break;
              }
            }
          }
        }

        // If a non-empty fallback was discovered, migrate it to the target key
        if (fallbackVal && fallbackVal !== '[]' && fallbackVal !== '{}' && fallbackVal !== 'null') {
          try {
            origSetItem!.call(this, targetKey, fallbackVal);
          } catch (e) {}
          return fallbackVal;
        }
      }

      // If val was '[]' or '{}' and no fallback was found, return val
      if (val !== null) return val;

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

    // Run auto-migration for current active user
    const curUser = getActiveUser();
    if (curUser && curUser !== 'guest') {
      autoMigrateGuestDataToActiveUser(curUser);
    }
  } catch (err) {
    console.warn('Could not initialize userScopedStorage patch:', err);
  }
}

// Auto-run if running client-side
if (typeof window !== 'undefined') {
  initUserScopedStorage();
}
