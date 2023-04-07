export function withTargetValue<T = string>(fn: (value: T) => void) {
  return (e: { currentTarget: { value: T } }) => fn(e.currentTarget.value);
}
