import { ChangeEvent, useCallback, useMemo, useState } from "react";

type UseInputParams = {
  initValue?: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
};

export function useInput(params: UseInputParams) {
  const { onChange: parentOnChange, onBlur: parentOnBlur } = params;
  const [currentValue, setCurrentValue] = useState(params.initValue || "");

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setCurrentValue(e.currentTarget.value);
      parentOnChange?.(e.currentTarget.value);
    },
    [parentOnChange]
  );
  const onBlur = useCallback(() => {
    parentOnBlur?.(currentValue);
  }, [parentOnBlur, currentValue]);

  const inputProps = useMemo(
    () => ({
      onChange,
      onBlur,
      value: currentValue,
    }),
    [currentValue, onChange, onBlur]
  );

  return useMemo(
    () => ({
      inputProps,
      currentValue,
      setCurrentValue,
    }),
    [inputProps, currentValue, setCurrentValue]
  );
}
