import { useCallback, useRef } from 'react';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitResult {
  canProceed: () => boolean;
  remaining: number;
  reset: () => void;
}

/**
 * Hook for rate limiting API calls or user actions
 * 
 * @param config - Rate limit configuration
 * @returns Rate limit control functions
 * 
 * @example
 * const { canProceed, remaining } = useRateLimit({
 *   maxRequests: 10,
 *   windowMs: 60000, // 10 requests per minute
 * });
 * 
 * if (!canProceed()) {
 *   setError(`Rate limit exceeded. Wait ${remaining} seconds.`);
 *   return;
 * }
 */
export const useRateLimit = (config: RateLimitConfig): RateLimitResult => {
  const { maxRequests, windowMs } = config;
  const requestTimestamps = useRef<number[]>([]);

  const canProceed = useCallback((): boolean => {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Remove timestamps outside the current window
    requestTimestamps.current = requestTimestamps.current.filter(
      timestamp => timestamp > windowStart
    );

    // Check if we're under the limit
    if (requestTimestamps.current.length >= maxRequests) {
      return false;
    }

    // Add current request timestamp
    requestTimestamps.current.push(now);
    return true;
  }, [maxRequests, windowMs]);

  const getRemaining = (): number => {
    if (requestTimestamps.current.length === 0) {
      return 0;
    }

    const now = Date.now();
    const oldestRequest = requestTimestamps.current[0];
    const timeUntilReset = Math.max(0, windowMs - (now - oldestRequest));
    
    return Math.ceil(timeUntilReset / 1000); // Return seconds
  };

  const reset = useCallback(() => {
    requestTimestamps.current = [];
  }, []);

  return {
    canProceed,
    remaining: getRemaining(),
    reset,
  };
};

/**
 * Hook for debouncing values to prevent excessive operations
 * 
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebouncedValue(searchTerm, 300);
 * 
 * // Use debouncedSearch for filtering/API calls
 * useEffect(() => {
 *   fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 */
export const useDebouncedValue = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Re-export for convenience
import { useState, useEffect } from 'react';
