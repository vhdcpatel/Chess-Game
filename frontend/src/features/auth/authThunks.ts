import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginHandler, signupHandler } from "../../services/apis/auth";
import { LoginCallPayLoad, SingUpCallPayLoad, AuthState } from "./authTypes";

export const loginUser = createAsyncThunk<
    authToken,
    LoginCallPayLoad,
    { rejectValue: string }
>(
    "auth/loginUser",
    async (payload, thunkAPI) => {
        try {
            const response = await loginHandler(payload);
            if (response.status !== 200 || !response.data.user || !response.data.authToken) {
                return thunkAPI.rejectWithValue("Invalid credentials");
            }
            return {
                user: response.data.user,
                authToken: response.data.authToken,
            };
        } catch (err) {
            return thunkAPI.rejectWithValue("Login failed");
        }
    }
);

export const signupUser = createAsyncThunk<
    AuthState,
    SingUpCallPayLoad,
    { rejectValue: string }
>(
    "auth/signupUser",
    async (payload, thunkAPI) => {
        try {
            const response = await signupHandler(payload);
            if (response.status !== 201 || !response.data.user || !response.data.authToken) {
                return thunkAPI.rejectWithValue("Signup failed");
            }

            return {
                user: response.data.user,
                authToken: response.data.authToken
            };
        } catch (err) {
            return thunkAPI.rejectWithValue("Signup failed");
        }
    }
);
