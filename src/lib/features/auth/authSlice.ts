import React from 'react';
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    refreshToken: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refresh;
    },
    logout: (state) => {
      sessionStorage.clear();
      state.token = null;
      state.refreshToken = null;
    }
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice;
