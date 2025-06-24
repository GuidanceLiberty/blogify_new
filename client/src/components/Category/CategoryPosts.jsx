import React from 'react'
import MainLayout from '../MainLayout'
import useSWR from 'swr';
import { Link, useParams } from 'react-router-dom';
import PostCardSkeleton from '../post/PostCardSkeleton';
import PostCard from '../post/PostCard';
import { FaArrowRight } from 'react-icons/fa';

const CategoryPosts = () => {

    const userInfo = localStorage.getItem('user');
    const user = JSON.parse(userInfo);
    const params = useParams();
    const category_id = params?.category_id;
  
    const URL = process.env.REACT_APP_BASE_URL;
    const fetcher = (...args) => fetch(...args, {headers: {'Authorization': `Bearer ${user.token}`}}).then((Response) => Response.json());
    const { data: posts, mutate, error, isLoading } = useSWR(`${URL}/categories/category-posts/${category_id}`, fetcher);
    

  return (
    <MainLayout>
        <div className='my-12 mx-6'>
            <h2 className='mb-2 font-roboto text-xl font-light tracking-medium text-center'>Category Post
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
            posts?.data && posts?.data?.map((post) => (
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
            </h2>  <hr />
        </div>
    </MainLayout>
  )
}

export default CategoryPosts