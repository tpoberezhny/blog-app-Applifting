import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface UserState {
  email: string | null;
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: UserState = {
  email: null,
  token: null,
  isAuthenticated: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.email = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('email');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.token = action.payload.token;
      state.email = action.meta.arg.email;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('email', action.meta.arg.email);
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
