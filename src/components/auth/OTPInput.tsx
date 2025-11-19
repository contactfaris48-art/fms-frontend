import { useOTPInput } from './useOTPInput';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  numInputs?: number;
  autoFocus?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  onComplete?: (otp: string) => void;
}

/**
 * OTP Input Component
 * Renders a series of input fields for entering OTP codes
 * All logic is handled by useOTPInput hook
 */
export default function OTPInput({
  value,
  onChange,
  numInputs = 6,
  autoFocus = true,
  disabled = false,
  hasError = false,
  onComplete,
}: OTPInputProps) {
  const {
    inputRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleFocus,
  } = useOTPInput({
    value,
    onChange,
    numInputs,
    autoFocus,
    disabled,
    onComplete,
  });

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: numInputs }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          disabled={disabled}
          className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl transition-all duration-200 ${
            hasError
              ? 'border-red-500 bg-red-50 text-red-900'
              : value[index]
              ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
              : 'border-gray-300 bg-white text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
}