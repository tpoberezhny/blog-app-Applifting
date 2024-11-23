import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  votes: number;
}

interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ articleId, content, author }: { articleId: string; content: string; author: string }) => {
    const response = await axios.post(`http://localhost:5000/api/articles/${articleId}/comments`, { content, author });
    return response.data;
  }
);

export const upvoteComment = createAsyncThunk(
  'comments/upvoteComment',
  async ({ articleId, commentId }: { articleId: string; commentId: string }) => {
    const response = await axios.post(`http://localhost:5000/api/articles/${articleId}/comments/${commentId}/vote/up`);
    return response.data;
  }
);

export const downvoteComment = createAsyncThunk(
  'comments/downvoteComment',
  async ({ articleId, commentId }: { articleId: string; commentId: string }) => {
    const response = await axios.post(`http://localhost:5000/api/articles/${articleId}/comments/${commentId}/vote/down`);
    return response.data;
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        state.loading = false;
        state.comments.push(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add comment';
      })
      .addCase(upvoteComment.fulfilled, (state, action: PayloadAction<{ commentId: string; votes: number }>) => {
        const comment = state.comments.find((c) => c.id === action.payload.commentId);
        if (comment) {
          comment.votes = action.payload.votes;
        }
      })
      .addCase(downvoteComment.fulfilled, (state, action: PayloadAction<{ commentId: string; votes: number }>) => {
        const comment = state.comments.find((c) => c.id === action.payload.commentId);
        if (comment) {
          comment.votes = action.payload.votes;
        }
      });
  },
});

export default commentSlice.reducer;
