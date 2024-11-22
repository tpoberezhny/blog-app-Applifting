import express from 'express';
import {
  createComment,
  upvoteComment,
  downvoteComment
} from '../controllers/commentController';

const router = express.Router();

// Create a new comment
router.post('/comments', createComment);

// Upvote a comment
router.post('/comments/:commentId/vote/up', upvoteComment);

// Downvote a comment
router.post('/comments/:commentId/vote/down', downvoteComment);

export default router;