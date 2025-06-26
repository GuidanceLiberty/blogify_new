import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import useSWR from "swr";
import axios from "axios";

const fetcher = async (url, token) => {
  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return res.data;
};

const Posts = ({ results }) => {
  const { user } = useAuthContext();

  const {
    data,
    error,
    isLoading,
  } = useSWR(
    user?.token ? [`${process.env.REACT_APP_BASE_URL}/posts`, user.token] : null,
    ([url, token]) => fetcher(url, token)
  );

  const posts = data?.posts || results || [];

  if (isLoading) {
    return <div className="text-center py-10 text-xl">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Failed to load posts</div>;
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-8">
      {posts.length > 0 ? (
        posts.map((post) => {
          const imageUrl = post.photo?.startsWith("http")
            ? post.photo
            : `${process.env.REACT_APP_UPLOAD_URL}${post.photo}`;

          return (
            <div key={post._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 flex flex-col justify-between transition hover:shadow-xl">
              <Link to={`/post/${post.slug}`}>
                <img
                  src={imageUrl}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                  loading="lazy"
                />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
                  {post.body.length > 100 ? post.body.slice(0, 100) + "..." : post.body}
                </p>
              </Link>
            </div>
          );
        })
      ) : (
        <p className="text-center col-span-full text-gray-500">No posts found</p>
      )}
    </section>
  );
};

export default Posts;
