import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook for managing feature state with session storage persistence
 * State is preserved on refresh but cleared when navigating away
 */
export function useFeatureState<T>(
  initialState: T,
  featureName: string
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const location = useLocation();
  const storageKey = `feature_state_${featureName}`;

  // Load from sessionStorage on mount
  const [state, setState] = useState<T>(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading feature state:', error);
    }
    return initialState;
  });

  // Save to sessionStorage whenever state changes
  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving feature state:', error);
    }
  }, [state, storageKey]);

  // Clear on unmount if navigating away from feature
  useEffect(() => {
    return () => {
      // Only clear if not refreshing and not on the same feature route
      if (!location.pathname.includes(`/dashboard/features/${featureName}`)) {
        try {
          sessionStorage.removeItem(storageKey);
        } catch (error) {
          console.error('Error clearing feature state:', error);
        }
      }
    };
  }, [location, featureName, storageKey]);

  return [state, setState];
}
