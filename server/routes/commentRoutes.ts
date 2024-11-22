import express from 'express';
import {
  createComment,
  upvoteComment,
  downvoteComment
} from '../controllers/commentController';

const router = express.Router();

// Create a new comment
router.post('/', createComment);

// Upvote a comment
router.post('/:commentId/vote/up', upvoteComment);

// Downvote a comment
router.post('/:commentId/vote/down', downvoteComment);

export default router;