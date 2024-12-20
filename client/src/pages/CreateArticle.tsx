import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { createArticle } from "../redux/slices/createArticle";
import { useNavigate } from "react-router-dom";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import Showdown from "showdown";

const CreateArticle: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const [image, setImage] = useState<File | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("You need to be logged in to create an article.");
      return;
    }

    if (!title || !content) {
      alert("Title and content are required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      const resultAction = await dispatch(createArticle(formData));

      if (createArticle.rejected.match(resultAction)) {
        alert("Failed to create article: " + resultAction.payload);
        return;
      }
      navigate("/my-articles");
    } catch (error) {
      alert("Something went wrong while creating the article.");
    }
  };

  const converter = new Showdown.Converter();

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 text-left">
      <h1 className="text-3xl font-bold mb-6">Create new article</h1>
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">
          Article Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">
          Featured Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Content</label>
        <ReactMde
          value={content}
          onChange={setContent}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          generateMarkdownPreview={(markdown) =>
            Promise.resolve(converter.makeHtml(markdown))
          }
          childProps={{
            writeButton: {
              tabIndex: -1,
            },
          }}
          classes={{
            textArea: "w-full p-2 border border-gray-300 rounded h-60",
          }}
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
      >
        Publish Article
      </button>
    </div>
  );
};

export default CreateArticle;
