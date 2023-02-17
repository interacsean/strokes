import { FC } from 'react';

export function withDependencies<T extends JSX.IntrinsicAttributes>(Component: FC<T>) {

  return (props: T) => (
    <Component {...props} />
  )
}