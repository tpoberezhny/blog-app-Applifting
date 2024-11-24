import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

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

export const createArticle = createAsyncThunk(
  "articles/createArticle",
  async (formData: FormData, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        throw new Error('Unauthorized: Missing authentication token');
      }
      
      const response = await axios.post("http://localhost:5000/api/articles", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create an article');
    }
  }
);

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
      })
      .addCase(createArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createArticle.fulfilled, (state, action: PayloadAction<Article>) => {
        state.loading = false;
        state.articles.push(action.payload);
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default articleSlice.reducer;
