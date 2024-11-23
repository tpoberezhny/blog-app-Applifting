import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles } from "../redux/slices/articleSlice";
import { RootState, AppDispatch } from "../redux/store";
import { format } from 'date-fns';

const RecentArticles: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { articles, loading, error } = useSelector(
    (state: RootState) => state.articles
  );

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  //We can implement React.Skeleton for loading

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="px-10 py-8">
      <h1 className="text-3xl font-bold mb-6 text-left">Recent Articles</h1>
      {articles.map((article) => (
        <div key={article.id} className="flex items-start mb-8 text-left">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-48 h-32 object-cover rounded mr-6"
          />
          <div>
            <h2 className="text-xl font-bold">{article.title}</h2>
            <p className="text-sm text-gray-600 mb-2">
            {article.author} • {format(new Date(article.updatedAt), 'MMM dd, yyyy')}
            </p>
            <p className="text-gray-700 mb-4">{article.perex}</p>
            <a
              href={`/articles/${article.id}`}
              className="text-blue-600 hover:underline"
            >
              Read whole article
            </a>
            <p className="text-sm text-gray-600 mt-2">
              {article.commentsCount > 0
                ? `${article.commentsCount} comments`
                : "No comments"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentArticles;
