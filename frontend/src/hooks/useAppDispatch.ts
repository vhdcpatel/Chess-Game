import { useDispatch } from "react-redux";
import { AppDispatch } from "../features";

export const useAppDispatch = ()=> useDispatch<AppDispatch>();