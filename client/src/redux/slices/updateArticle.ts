import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

export const updateArticle = createAsyncThunk(
  "articles/updateArticle",
  async (
    { id, formData }: { id: string; formData: FormData },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (!token) {
        throw new Error("Unauthorized: Missing authentication token");
      }

      const response = await axios.patch(
        `http://localhost:5000/api/articles/${id}`,
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
        error.response?.data?.message || "Failed to update the article"
      );
    }
  }
);