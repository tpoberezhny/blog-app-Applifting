import express from 'express';
import {
  createComment,
  upvoteComment,
  downvoteComment,
  getCommentsByArticleId,
} from '../controllers/commentController';

const router = express.Router({ mergeParams: true });

// Create a new comment on a specific article
router.post('/', createComment);

//Get all comments for a specific article
router.get('/', getCommentsByArticleId);

// Upvote a comment
router.post('/:commentId/vote/up', upvoteComment);

// Downvote a comment
router.post('/:commentId/vote/down', downvoteComment);

export default router;
