/**
 * Utility functions for session storage management
 * Centralized to prevent code duplication
 */

const FEATURE_STATE_PREFIX = 'feature_state_';

/**
 * Clear all feature-related session storage
 */
export function clearAllFeatureStates(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(FEATURE_STATE_PREFIX)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => {
      sessionStorage.removeItem(key);
      console.log(`Cleared session storage: ${key}`);
    });
  } catch (error) {
    console.error('Error clearing feature states:', error);
  }
}

/**
 * Clear specific feature state from session storage
 */
export function clearFeatureState(featureName: string): void {
  try {
    const storageKey = `${FEATURE_STATE_PREFIX}${featureName}`;
    sessionStorage.removeItem(storageKey);
    console.log(`Cleared session storage: ${storageKey}`);
  } catch (error) {
    console.error(`Error clearing feature state for ${featureName}:`, error);
  }
}

/**
 * Get feature state storage key
 */
export function getFeatureStorageKey(featureName: string): string {
  return `${FEATURE_STATE_PREFIX}${featureName}`;
}
