import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchArticleById } from "../redux/slices/articleSlice";
import {
  addComment,
  upvoteComment,
  downvoteComment,
  fetchCommentsByArticleId,
} from "../redux/slices/commentSlice";
import { RootState, AppDispatch } from "../redux/store";
import { format } from "date-fns";

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { articleDetail, loading, error } = useSelector(
    (state: RootState) => state.articles
  );
  const { comments } = useSelector(
    (state: RootState) => state.comments
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const [newComment, setNewComment] = useState<string>("");

  useEffect(() => {
    if (id) {
      dispatch(fetchArticleById(id));
      dispatch(fetchCommentsByArticleId(id));
    }
  }, [dispatch, id]);

  const handleAddComment = () => {
    if (user && id) {
      console.log("Adding comment:", { articleId: id, content: newComment, author: user.name });
      dispatch(addComment({ articleId: id, content: newComment, author: user.name }));
      setNewComment("");
    } else {
      alert("You need to log in to add a comment");
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  const handleUpvoteComment = (commentId: string) => {
    if (user && id) {
      dispatch(upvoteComment({ articleId: id, commentId }));
    } else {
      alert("You need to log in to upvote");
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  const handleDownvoteComment = (commentId: string) => {
    if (user && id) {
      dispatch(downvoteComment({ articleId: id, commentId }));
    } else {
      alert("You need to log in to downvote");
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!articleDetail) return <p>Article not found</p>;

  return (
    <div className="px-10 py-8 text-left">
      <h1 className="text-4xl font-bold mb-4">{articleDetail.title}</h1>
      <p className="text-sm text-gray-600 mb-4">
        {articleDetail.author && articleDetail.author.name} •{" "}
        {format(new Date(articleDetail.updatedAt), "MM/dd/yyyy")}
      </p>
      <img
        src={articleDetail.imageUrl}
        alt={articleDetail.title}
        className="w-full h-auto mb-6 rounded"
      />
      <div className="text-gray-800 mb-6">
        {articleDetail && articleDetail.content && (
          <p>{articleDetail.content}</p>
        )}
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
        Comments ({comments.length})
        </h2>
        {user ? (
          <div className="mb-4">
            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-2"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Join the discussion..."
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleAddComment}
            >
              Add Comment
            </button>
          </div>
        ) : (
          <p className="text-gray-600 mb-4">
            You need to{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              log in
            </span>{" "}
            to join the discussion.
          </p>
        )}
        {comments.map((comment) => (
            <div key={comment._id} className="mb-6 border-b pb-4">
              <p className="font-bold text-sm">
                {comment.author} •{" "}
                {format(new Date(comment.createdAt), "MM/dd/yyyy")}
              </p>
              <p className="text-gray-800 mb-2">{comment.content}</p>
              <div className="flex space-x-4 text-sm text-gray-600">
                <button
                  className="hover:text-blue-600"
                  onClick={() => handleUpvoteComment(comment._id)}
                >
                  Upvote ({comment.votes})
                </button>
                <button
                  className="hover:text-blue-600"
                  onClick={() => handleDownvoteComment(comment._id)}
                >
                  Downvote
                </button>
              </div>
            </div>
          ))}
      </div>
      {/* Related articles placeholder */}
      {/* // We can implement it with: fetching articles with similar tags, categories, or by the same author */}
    </div>
  );
};

export default ArticleDetail;
