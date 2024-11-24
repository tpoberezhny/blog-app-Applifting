import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchArticles = createAsyncThunk(
  "articles/fetchArticles",
  async () => {
    const response = await axios.get("http://localhost:5000/api/articles");
    return response.data;
  }
);

export const fetchArticleById = createAsyncThunk(
  "articles/fetchArticleById",
  async (id: string) => {
    const response = await axios.get(
      `http://localhost:5000/api/articles/${id}`
    );
    return response.data;
  }
);
