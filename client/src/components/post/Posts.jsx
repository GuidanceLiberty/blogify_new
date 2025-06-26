import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import PostCard from "./PostCard";
import PostCardSkeleton from "./PostCardSkeleton";
import useSWR from "swr";

const Posts = ({ limit, results }) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  let user = localStorage.getItem('user');
  user = user ? JSON.parse(user) : null;

  const fetcher = (...args) =>
    fetch(...args, {
      headers: user ? { Authorization: `Bearer ${user.token}` } : {},
    }).then((res) => res.json());

  const { data, mutate, error, isLoading } = useSWR(
    `${BASE_URL}/posts?limit=${limit}`,
    fetcher
  );

  const posts = data?.posts || [];

  return (
    <section className="flex flex-col container mx-auto px-5 py-10">
      <div className="flex flex-wrap md:gap-x-5 gap-y-5 pb-10">
        {isLoading ? (
          [...Array(3)].map((_, index) => (
            <PostCardSkeleton
              key={index}
              className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
            />
          ))
        ) : (results?.length > 0 ? results : posts).map((post) => (
          <PostCard
            key={post._id}
            post={post}
            mutate={mutate}
            className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
          />
        ))}
      </div>

      <Link
        to="/blog"
        className="mx-auto flex items-center gap-x-2 font-bold text-red-800 border-[1px] border-red-400 px-6 py-2 rounded-lg"
      >
        <span>More Posts</span>
        <FaArrowRight className="w-3 h-3 text-red-600" />
      </Link>
    </section>
  );
};

export default Posts;
