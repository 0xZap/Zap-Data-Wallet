import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";

/*
Note - Token and User are not used right now and may be used later
*/
interface AuthState {
  isAuthenticated: boolean;
  password?: string;
  token?: string;
  user?: User;
}

const initialState: AuthState = {
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ isAuthenticated: boolean; password?: string; token?: string; user?: User }>
    ) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.password = action.payload.password;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.password = undefined;
      state.token = undefined;
      state.user = undefined;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
