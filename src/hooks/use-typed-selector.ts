import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState } from '../state';

// connect type of data between react and redux, it allows react to understand type of data stored inside of store
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
