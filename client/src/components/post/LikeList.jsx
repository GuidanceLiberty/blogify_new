import { RiHeartFill } from "@remixicon/react";
import PostCard from "./PostCard";
import PostCardSkeleton from "./PostCardSkeleton";
import useSWR from 'swr';


const LikeList = () => {

  const filename = 'sweets.jpeg';

  const URL = process.env.REACT_APP_BASE_URL;
  const userInfo = localStorage.getItem('user');
  const user = JSON.parse(userInfo);

      
    const fetcher = (...args) => fetch(...args).then((Response) => Response.json());
    const { data: posts, mutate, error, isLoading } = useSWR(`${URL}/posts/likes/${user?._id}?limit=10`, fetcher);

  // console.log("Liked Post => ", posts?.data?.likes);


  return (
    <section>
      <div className="header-div">
        <div className="post-header mb-8 font-roboto text-xl font-light tracking-medium flex items-center"> 
            Viewing your  <RiHeartFill size={18} className="mx-1 text-red-600" /> posts </div>  
      </div>
        

      <div className="container mx-auto px-5 sm:px-5">
        <div className="flex flex-wrap md:gap-x-5 gap-y-5 pb-10">
          {isLoading ? (
            [...Array(3)].map((item, index) => (
              <PostCardSkeleton
                key={index}
                className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
              />
            ))
          ) : (
            posts?.data && posts?.data?.likes?.map((post) => (
              <PostCard
                key={post?._id}
                post={post}
                className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
              />
            ))
          )}
        </div>
      </div>
        
    </section>
  )
}

export default LikeList
