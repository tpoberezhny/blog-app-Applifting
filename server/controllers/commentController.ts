import { Request, Response } from 'express';
import Comment from '../models/Comment';
import mongoose from 'mongoose';

export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content, author, articleId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      res.status(400).json({ message: 'Invalid article ID' });
      return;
    }
    const comment = new Comment({ content, author, articleId });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const upvoteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {
      res.status(400).json({ message: 'Invalid comment ID' });
      return;
    }
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }
    comment.votes += 1;
    await comment.save();
    res.status(200).json({ message: 'Upvoted successfully', votes: comment.votes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const downvoteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {
      res.status(400).json({ message: 'Invalid comment ID' });
      return;
    }
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }
    comment.votes -= 1;
    await comment.save();
    res.status(200).json({ message: 'Downvoted successfully', votes: comment.votes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};