// Single Point of Export for all Redux Toolkit.

export { store } from './store';
export type { AppDispatch } from './store';
export type { RootState } from './store';

// To use Context.
export { useAppDispatch } from '../hooks/useAppDispatch';
export { useAppSelector } from '../hooks/useAppSelector';