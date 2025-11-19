import { useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';

interface UseOTPInputProps {
  value: string;
  onChange: (value: string) => void;
  numInputs: number;
  autoFocus: boolean;
  disabled: boolean;
  onComplete?: (otp: string) => void;
}

export const useOTPInput = ({
  value,
  onChange,
  numInputs,
  autoFocus,
  disabled,
  onComplete,
}: UseOTPInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  // Call onComplete when OTP is fully entered
  useEffect(() => {
    if (value.length === numInputs && onComplete) {
      onComplete(value);
    }
  }, [value, numInputs, onComplete]);

  const handleChange = (index: number, digit: string) => {
    if (disabled) return;

    // Only allow digits
    if (!/^\d*$/.test(digit)) return;

    const newValue = value.split('');
    newValue[index] = digit;
    const newOTP = newValue.join('').slice(0, numInputs);
    
    onChange(newOTP);

    // Move to next input if digit was entered
    if (digit && index < numInputs - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newValue = value.split('');
      
      if (newValue[index]) {
        // Clear current input
        newValue[index] = '';
        onChange(newValue.join(''));
      } else if (index > 0) {
        // Move to previous input and clear it
        newValue[index - 1] = '';
        onChange(newValue.join(''));
        inputRefs.current[index - 1]?.focus();
      }
    }

    // Handle left arrow
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }

    // Handle right arrow
    if (e.key === 'ArrowRight' && index < numInputs - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;

    const pastedData = e.clipboardData.getData('text/plain').slice(0, numInputs);
    
    // Only allow digits
    if (!/^\d+$/.test(pastedData)) return;

    onChange(pastedData);

    // Focus the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, numInputs - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleFocus = (index: number) => {
    // Select the input content on focus
    inputRefs.current[index]?.select();
  };

  return {
    inputRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleFocus,
  };
};