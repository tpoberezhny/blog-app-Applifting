import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

export const deleteArticle = createAsyncThunk(
  "articles/deleteArticle",
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) {
        throw new Error("Unauthorized: Missing authentication token");
      }

      const response = await axios.delete(
        `http://localhost:5000/api/articles/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete the article"
      );
    }
  }
);
