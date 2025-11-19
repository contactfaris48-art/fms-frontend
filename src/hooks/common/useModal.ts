import { useState, useCallback } from 'react';

/**
 * Generic modal state management hook
 * @param initialState - Initial open state (default: false)
 */
export const useModal = (initialState: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  };
};

/**
 * Modal hook with data management
 * Useful for edit/view modals that need to track selected item
 */
export const useModalWithData = <T = any>(initialState: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState<T | null>(null);

  const open = useCallback((itemData?: T) => {
    if (itemData) {
      setData(itemData);
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Clear data after animation completes
    setTimeout(() => setData(null), 300);
  }, []);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
    setData,
    setIsOpen,
  };
};