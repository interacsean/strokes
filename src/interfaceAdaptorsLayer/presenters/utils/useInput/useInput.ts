import { ChangeEvent, useState } from "react"

type UseInputParams = {
  initValue?: string,
  onChange?: (value: string) => void,
  onBlur?: (value: string) => void,
}

export function useInput(params: UseInputParams) {
  const [ currentValue, setCurrentValue ] = useState(params.initValue || '');
  
  // todo: useCallback/useMemos
  return {
    inputProps: {
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        setCurrentValue(e.currentTarget.value);
        params.onChange?.(e.currentTarget.value);
      },
      onBlur: () => {
        params.onBlur?.(currentValue)
      },
      value: currentValue,
    },
    currentValue,
    setCurrentValue,
  }
}
