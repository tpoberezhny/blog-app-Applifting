import { Schema, model } from 'mongoose';

const ArticleSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  commentsCount: { type: Number, default: 0 },
  imageUrl: { type: String },
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default model('Article', ArticleSchema);
