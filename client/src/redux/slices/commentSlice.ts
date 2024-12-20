import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Comment {
  _id: string;
  author: string;
  content: string;
  createdAt: string;
  votes: number;
  votesUsers?: { [userId: string]: "upvote" | "downvote" };
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

export const fetchCommentsByArticleId = createAsyncThunk(
  "comments/fetchCommentsByArticleId",
  async (articleId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/articles/${articleId}/comments`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const addComment = createAsyncThunk(
  "comments/addComment",
  async (
    {
      articleId,
      content,
      author,
    }: { articleId: string; content: string; author: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("Sending request to add comment:", { content, author });
      const response = await axios.post(
        `http://localhost:5000/api/articles/${articleId}/comments`,
        { content, author }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error adding comment:", error.response.data);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const upvoteComment = createAsyncThunk(
  "comments/upvoteComment",
  async ({
    articleId,
    commentId,
    userId,
  }: {
    articleId: string;
    commentId: string;
    userId: string;
  }) => {
    const response = await axios.post(
      `http://localhost:5000/api/articles/${articleId}/comments/${commentId}/vote/up`,
      { userId }
    );
    return { commentId, votes: response.data.votes, userId };
  }
);

export const downvoteComment = createAsyncThunk(
  "comments/downvoteComment",
  async ({
    articleId,
    commentId,
    userId,
  }: {
    articleId: string;
    commentId: string;
    userId: string;
  }) => {
    const response = await axios.post(
      `http://localhost:5000/api/articles/${articleId}/comments/${commentId}/vote/down`,
      { userId }
    );
    return { commentId, votes: response.data.votes, userId };
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByArticleId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCommentsByArticleId.fulfilled,
        (state, action: PayloadAction<Comment[]>) => {
          state.loading = false;
          state.comments = action.payload;
        }
      )
      .addCase(fetchCommentsByArticleId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addComment.fulfilled,
        (state, action: PayloadAction<Comment>) => {
          state.loading = false;
          state.comments.push(action.payload);
        }
      )
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add comment";
      })
      .addCase(upvoteComment.fulfilled, (state, action) => {
        const { commentId, votes, userId } = action.payload;
        const comment = state.comments.find((c) => c._id === commentId);
        if (comment) {
          comment.votes = votes;
          comment.votesUsers = { ...comment.votesUsers, [userId]: "upvote" };
        }
      })
      .addCase(downvoteComment.fulfilled, (state, action) => {
        const { commentId, votes, userId } = action.payload;
        const comment = state.comments.find((c) => c._id === commentId);
        if (comment) {
          comment.votes = votes;
          comment.votesUsers = { ...comment.votesUsers, [userId]: "downvote" };
        }
      });
  },
});

export default commentSlice.reducer;
