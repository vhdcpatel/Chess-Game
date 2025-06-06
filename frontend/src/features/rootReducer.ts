import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userInfo/userInfo";
import authReducer from "./auth/authSlice";
import chessReducer from "./chessGame/chessSlice"

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  chess: chessReducer,
})

export default rootReducer;