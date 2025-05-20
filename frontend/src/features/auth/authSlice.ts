import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, UserInfo } from "./authTypes";

const initialState:AuthState = {
  isAuthenticated: false,
  user: null,
  authToken: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers:{
    login:(state,action: PayloadAction<{user: UserInfo, token: string}>)=>{
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.authToken = action.payload.token;
    },

    logout: () => initialState,

    setToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
    }
  }
})

export const { login, logout, setToken } = authSlice.actions;
export default authSlice.reducer;
// export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;