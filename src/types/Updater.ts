export type Updater<T, O> = (newStateOrUpdater: T | ((currentState: T & O) => T)) => void;
