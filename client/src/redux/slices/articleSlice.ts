import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Author {
  name: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  votes: number;
}

export interface Article {
  _id: string;
  title: string;
  author: Author;
  content: string;
  updatedAt: string;
  perex: string;
  commentsCount: number;
  comments: Comment[];
  imageUrl: string; 
}

interface ArticleState {
  articleDetail: Article | null;
  articles: Article[];
  loading: boolean;
  error: string | null;
}

const initialState: ArticleState = {
  articleDetail: null,
  articles: [],
  loading: false,
  error: null,
};

export const fetchArticles = createAsyncThunk('articles/fetchArticles', async () => {
  const response = await axios.get('http://localhost:5000/api/articles');
  return response.data;
});

export const fetchArticleById = createAsyncThunk('articles/fetchArticleById', async (id: string) => {
  const response = await axios.get(`http://localhost:5000/api/articles/${id}`);
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
        state.error = action.error.message || 'Failed to fetch an articles';
      })
      .addCase(fetchArticleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticleById.fulfilled, (state, action: PayloadAction<Article>) => {
        state.loading = false;
        state.articleDetail = action.payload;
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch an article';
      });
  },
});

export default articleSlice.reducer;
