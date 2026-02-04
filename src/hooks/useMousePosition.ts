"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// 60fps = ~16.67ms between frames
const THROTTLE_MS = 1000 / 60;

export interface MousePosition {
  /** Raw x coordinate relative to viewport */
  x: number;
  /** Raw y coordinate relative to viewport */
  y: number;
  /** Normalized x from -1 (left) to 1 (right) */
  normalizedX: number;
  /** Normalized y from -1 (top) to 1 (bottom) */
  normalizedY: number;
  /** Whether reduced motion is preferred */
  isReducedMotion: boolean;
}

const DEFAULT_POSITION: MousePosition = {
  x: 0,
  y: 0,
  normalizedX: 0,
  normalizedY: 0,
  isReducedMotion: false,
};

/**
 * Hook for tracking mouse position with throttling for performance.
 * Returns normalized coordinates useful for eye offset calculations.
 *
 * @example
 * const { normalizedX, normalizedY, isReducedMotion } = useMousePosition();
 * const eyeOffsetX = isReducedMotion ? 0 : normalizedX * maxOffset;
 * const eyeOffsetY = isReducedMotion ? 0 : normalizedY * maxOffset;
 */
export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>(DEFAULT_POSITION);
  const [reducedMotion, setReducedMotion] = useState(false);
  const frameRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    // Skip if we're within the throttle window
    const now = performance.now();
    if (now - lastUpdateRef.current < THROTTLE_MS) return;
    lastUpdateRef.current = now;

    // Cancel any pending frame
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }

    // Schedule update on next animation frame for smooth rendering
    frameRef.current = requestAnimationFrame(() => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Normalize to -1 to 1 range
      // At left edge: -1, at center: 0, at right edge: 1
      const normalizedX = (clientX / viewportWidth) * 2 - 1;
      const normalizedY = (clientY / viewportHeight) * 2 - 1;

      setPosition((prev) => ({
        ...prev,
        x: clientX,
        y: clientY,
        normalizedX,
        normalizedY,
      }));
    });
  }, []);

  // Handle reduced motion preference
  useEffect(() => {
    // SSR guard
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleMediaChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  // Handle mouse tracking (only when reduced motion is not preferred)
  useEffect(() => {
    // SSR guard
    if (typeof window === "undefined") {
      return;
    }

    // Update position state with current reduced motion value
    setPosition((prev) => ({
      ...prev,
      isReducedMotion: reducedMotion,
    }));

    // Don't track mouse if reduced motion is preferred
    if (reducedMotion) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      updatePosition(event.clientX, event.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);

      // Clean up any pending animation frame
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [reducedMotion, updatePosition]);

  return position;
}

export default useMousePosition;
