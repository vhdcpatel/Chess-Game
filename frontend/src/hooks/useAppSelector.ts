import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "../features";

export const useAppSelector: TypedUseSelectorHook<RootState>   = useSelector;