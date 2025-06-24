import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import PostCard from "./PostCard";
import PostCardSkeleton from "./PostCardSkeleton";
import useSWR from "swr";

const Posts = ({ limit, results }) => {

  let user = localStorage.getItem('user');
  user = JSON.parse(user);


  const URL = process.env.REACT_APP_BASE_URL;
  const fecther = (...args) => fetch(...args, {headers: {'Authorization': `Bearer ${user.token}`}}).then((Response) => Response.json());
  const { data: posts, mutate, error, isLoading } = useSWR(`${URL}/posts?limit=${limit}`, fecther);

  //  console.log("Posts : ", posts);

  
    return (
      <section className="flex flex-col container mx-auto px-5 py-10">
        <div className=" flex flex-wrap md:gap-x-5 gap-y-5 pb-10">
  
          {isLoading ? (
            [...Array(3)].map((item, index) => (
              <PostCardSkeleton
                key={index}
                className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
              />
            ))
          ) : (

             results?.length > 0 ? results?.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                mutate={mutate}
                className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
              />
            ))

            :

            posts?.posts && posts?.posts?.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                mutate={mutate}
                className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
              />
            ))
          )}
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
