import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userInfo/userInfo";
import authReducer from "./auth/authSlice";

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
})

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;