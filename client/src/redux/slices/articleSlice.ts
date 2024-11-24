import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchArticles, fetchArticleById } from "./fetchArticles";
import { createArticle } from "./createArticle";
import { deleteArticle } from "./deleteArticle";
import { updateArticle } from "./updateArticle";

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

const articleSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //fetch
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchArticles.fulfilled,
        (state, action: PayloadAction<Article[]>) => {
          state.loading = false;
          state.articles = action.payload;
        }
      )
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch an articles";
      })
      //fetchById
      .addCase(fetchArticleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchArticleById.fulfilled,
        (state, action: PayloadAction<Article>) => {
          state.loading = false;
          state.articleDetail = action.payload;
        }
      )
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch an article";
      })
      //create
      .addCase(createArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createArticle.fulfilled,
        (state, action: PayloadAction<Article>) => {
          state.loading = false;
          state.articles.push(action.payload);
        }
      )
      .addCase(createArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //delete
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.articles = state.articles.filter(
          (article) => article._id !== action.meta.arg
        );
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      //update
      .addCase(updateArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateArticle.fulfilled,
        (state, action: PayloadAction<Article>) => {
          state.loading = false;
          state.articles = state.articles.map((article) =>
            article._id === action.payload._id ? action.payload : article
          );
        }
      )
      .addCase(updateArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default articleSlice.reducer;
