import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

export const createArticle = createAsyncThunk(
  "articles/createArticle",
  async (formData: FormData, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        throw new Error("Unauthorized: Missing authentication token");
      }

      const response = await axios.post(
        "http://localhost:5000/api/articles",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create an article"
      );
    }
  }
);
