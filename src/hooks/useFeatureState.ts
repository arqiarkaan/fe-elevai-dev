import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

/**
 * Custom hook for managing simple feature state with session storage persistence
 * State is preserved on refresh but cleared when navigating away
 * Use this for features WITHOUT multi-step flows
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

/**
 * Custom hook for managing step-based feature state with URL params and persistence
 * State IS preserved on refresh - maintains step and all data
 * State is cleared only when navigating away from the feature
 * Use this for features WITH multi-step flows (wizards)
 *
 * @param initialState - Initial state with step property
 * @param featureName - Feature identifier for storage
 * @param validateStep - Optional function to validate if a step is accessible
 */
export function useStepFeatureState<T extends { step?: number }>(
  initialState: T,
  featureName: string,
  validateStep?: (step: number, state: T) => boolean
): [T, React.Dispatch<React.SetStateAction<T>>, (step: number) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const storageKey = `feature_state_${featureName}`;

  // Track the current feature path to detect navigation away
  const [lastFeaturePath] = useState(() => location.pathname);

  // Load from sessionStorage on mount, sync with URL if exists
  const [state, setState] = useState<T>(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsedState = JSON.parse(saved);
        // If URL has step param, validate it before using
        const urlStep = searchParams.get('step');
        if (urlStep) {
          const requestedStep = parseInt(urlStep);
          // Validate step if validator provided
          if (validateStep && !validateStep(requestedStep, parsedState)) {
            // Invalid step, reset to valid step from saved state or initial
            return parsedState;
          }
          return { ...parsedState, step: requestedStep } as T;
        }
        return parsedState;
      }
    } catch (error) {
      console.error('Error loading feature state:', error);
    }

    // No saved state, check URL for step
    const urlStep = searchParams.get('step');
    if (urlStep) {
      const requestedStep = parseInt(urlStep);
      // If there's no saved state, only allow initial step
      if (requestedStep === initialState.step) {
        return { ...initialState, step: requestedStep } as T;
      }
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

  // Sync URL with current step and validate
  useEffect(() => {
    if (state.step) {
      const currentUrlStep = searchParams.get('step');
      const currentStep = state.step.toString();

      // Only update URL if it's different from current state
      if (currentUrlStep !== currentStep) {
        setSearchParams({ step: currentStep }, { replace: true });
      }
    }
  }, [state.step, searchParams, setSearchParams]);

  // Function to update step in both state and URL
  const setStep = (step: number | ((prev: number) => number)) => {
    setState((prev) => {
      const newStep = typeof step === 'function' ? step(prev.step || 1) : step;

      // Validate step if validator provided
      if (validateStep && !validateStep(newStep, prev)) {
        console.warn(
          `Invalid step transition to ${newStep}, staying at ${prev.step}`
        );
        return prev;
      }

      return { ...prev, step: newStep } as T;
    });
  };

  // Clear storage when navigating away from feature OR when returning to dashboard
  useEffect(() => {
    // Check if we're navigating away from the feature
    const isLeavingFeature =
      !location.pathname.includes(`/dashboard/features/${featureName}`) ||
      location.pathname === '/dashboard';

    // If we're leaving the feature, clear storage immediately
    if (isLeavingFeature && location.pathname !== lastFeaturePath) {
      try {
        sessionStorage.removeItem(storageKey);
        console.log(`Cleared feature state for: ${featureName}`);
      } catch (error) {
        console.error('Error clearing feature state:', error);
      }
    }
  }, [location.pathname, featureName, storageKey, lastFeaturePath]);

  // Also clear on unmount if not on the feature page
  useEffect(() => {
    return () => {
      // Clear if navigating to dashboard or away from feature
      const currentPath = window.location.pathname;
      if (
        !currentPath.includes(`/dashboard/features/${featureName}`) ||
        currentPath === '/dashboard'
      ) {
        try {
          sessionStorage.removeItem(storageKey);
          console.log(`Cleared feature state on unmount for: ${featureName}`);
        } catch (error) {
          console.error('Error clearing feature state:', error);
        }
      }
    };
  }, [featureName, storageKey]);

  return [state, setState, setStep];
}
