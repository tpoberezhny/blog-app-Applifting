import { Schema, model } from 'mongoose';

const CommentSchema = new Schema({
  content: { type: String, required: true },
  author: { type: String, required: true },
  articleId: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
  votes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default model('Comment', CommentSchema);