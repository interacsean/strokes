export type Updater<T, O> = (stateUpdaterFn: (currentState: T & O) => T) => void;
