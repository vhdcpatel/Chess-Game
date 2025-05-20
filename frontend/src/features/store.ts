import { configureStore } from "@reduxjs/toolkit";
import combineReducer from './rootReducer';


export const store = configureStore({
  reducer: combineReducer,
  // Add any middleware if needed
  // middleware: (getDefaultMiddleware) => 
  //   getDefaultMiddleware({
  //     serializableCheck: false, // Disable serializable check if needed
  //   }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;