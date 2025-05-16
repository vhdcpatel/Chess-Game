import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./Reducers/userInfo/userInfo";

const rootReducer = combineReducers({
  user: userReducer
})

export default rootReducer;