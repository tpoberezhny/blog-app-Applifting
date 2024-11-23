import { Request, Response } from 'express';
import Comment from '../models/Comment';
import mongoose from 'mongoose';

export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content, author } = req.body;
    const { articleId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      res.status(400).json({ message: 'Invalid article ID' });
      return;
    }

    if (!content || !author) {
      res.status(400).json({ message: 'Content and author are required' });
      return;
    }

    const comment = new Comment({ content, author, articleId });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error while creating comment:', error);
    res.status(500).json({ error: error.message });
  }
};

export const upvoteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { articleId, commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId) || !mongoose.Types.ObjectId.isValid(articleId)) {
      res.status(400).json({ message: 'Invalid article or comment ID' });
      return;
    }

    const comment = await Comment.findOne({ _id: commentId, articleId });
    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    comment.votes += 1;
    await comment.save();
    res.status(200).json({ message: 'Upvoted successfully', votes: comment.votes });
  } catch (error) {
    console.error('Error while upvoting comment:', error);
    res.status(500).json({ error: error.message });
  }
};

export const downvoteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { articleId, commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId) || !mongoose.Types.ObjectId.isValid(articleId)) {
      res.status(400).json({ message: 'Invalid article or comment ID' });
      return;
    }

    const comment = await Comment.findOne({ _id: commentId, articleId });
    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    comment.votes -= 1;
    await comment.save();
    res.status(200).json({ message: 'Downvoted successfully', votes: comment.votes });
  } catch (error) {
    console.error('Error while downvoting comment:', error);
    res.status(500).json({ error: error.message });
  }
};
