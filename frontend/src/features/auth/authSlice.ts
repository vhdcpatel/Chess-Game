import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "./authTypes";
import { loginUser, signupUser } from './authThunks'

const initialState:AuthState = {
  user: null,
  authToken: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers:{
    logout: () => initialState,

    setToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
        .addCase(loginUser.fulfilled, (state, action) => {
          // state.isAuthenticated = true;
          state.user = action.payload.user;
          state.authToken = action.payload.authToken;
        })
        .addCase(signupUser.fulfilled, (state, action) => {
          // state.isAuthenticated = true;
          state.user = action.payload.user;
          state.authToken = action.payload.authToken;
        });
  },
})

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;
// export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;