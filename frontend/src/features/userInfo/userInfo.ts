import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type stringOrNull = string | null;

export interface UserInfo {
  id: stringOrNull;
  name: stringOrNull;
  rating: number;
}

const InitialState: UserInfo = {
  id: null,
  name: null,
  rating: 0,
}

const userInfoSlice = createSlice({
  name:'UserInfo',
  initialState: InitialState,
  reducers:{
    setUserInfo: (state, action) => {
      const { id, name, rating } = action.payload;
      state.id = id;
      state.name = name;
      state.rating = rating;
    },
    resetUserInfo: (state) => {
      state.id = null;
      state.name = null;
      state.rating = 0;
    },
    updateRating: (state, action: PayloadAction<number>) => {
      const rating  = action.payload;
      state.rating = rating;
    }
  }
});

export const {setUserInfo, resetUserInfo} = userInfoSlice.actions;
export default userInfoSlice.reducer;

