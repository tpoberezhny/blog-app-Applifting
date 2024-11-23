import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Article {
  id: string;
  title: string;
  author: string;
  updatedAt: string;
  perex: string;
  commentsCount: number;
  imageUrl: string; 
}

interface ArticleState {
  articles: Article[];
  loading: boolean;
  error: string | null;
}

const initialState: ArticleState = {
  articles: [],
  loading: false,
  error: null,
};

export const fetchArticles = createAsyncThunk('articles/fetchArticles', async () => {
  const response = await axios.get('http://localhost:5000/api/articles');
  return response.data;
});

const articleSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action: PayloadAction<Article[]>) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch articles';
      });
  },
});

export default articleSlice.reducer;
