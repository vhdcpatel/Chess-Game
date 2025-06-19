import { configureStore } from "@reduxjs/toolkit";
import combineReducer from './rootReducer';


export const store = configureStore({
  reducer: combineReducer,
  // Add any middleware if needed
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types
          // (Use if your actions contain non-serializable data in the action payload)
          // ignoredActions: ['chess/initGame', 'chess/makeMove'],

          // Ignore these field paths in all actions
          // (ignore specific paths inside the action payload)
          // ignoredActionsPaths: ['payload.game'],

          // Ignore these paths in the state
          ignoredPaths: ['chess.game'],
        },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;