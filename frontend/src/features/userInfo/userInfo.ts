import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfo } from "./userInfoModel";

const InitialState: UserInfo = {
  id: null,
  name: null,
  rating: 0,
}

const userInfoSlice = createSlice({
  name:'UserInfo',
  initialState: InitialState,
  reducers:{
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      const { id, name, rating } = action.payload;
      state.id = id;
      state.name = name;
      state.rating = rating;
    },
    resetUserInfo: () => InitialState,
    updateRating: (state, action: PayloadAction<number>) => {
      const rating  = action.payload;
      state.rating = rating;
    }
  }
});

export const { setUserInfo, resetUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;

