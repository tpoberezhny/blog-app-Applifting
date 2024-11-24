import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles } from "../redux/slices/fetchArticles";
import { RootState, AppDispatch } from "../redux/store";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

const truncateContent = (
  content: string | undefined,
  maxSentences: number = 2
): string => {
  if (!content) {
    return "There is no content";
  }

  // Splitting content into sentences
  const sentences = content.match(/[^.!?]+[.!?]*/g) || [];
  const summary = sentences.slice(0, maxSentences).join(" ");
  return sentences.length > maxSentences ? `${summary}...` : summary;
};

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
        <div key={article._id} className="flex items-start mb-8 text-left">
          <div className="w-[272px] h-[244px] overflow-hidden flex-shrink-0 rounded-sm mr-6">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold">{article.title}</h2>
            <p className="text-sm text-gray-600 mb-2">
              {article.author.name} •{" "}
              {format(new Date(article.updatedAt), "MM/dd/yyyy")}
            </p>
            <p className="text-gray-700 mb-4">
              <ReactMarkdown>{truncateContent(article.content)}</ReactMarkdown>
            </p>
            <a
              href={`/articles/${article._id}`}
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
