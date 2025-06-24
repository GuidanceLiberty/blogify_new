import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import samplePostImage from '../assets/images/sample.jpg';
import MainLayout from '../components/MainLayout';
import PostCardSkeleton from "../components/post/PostCardSkeleton";
import SuggestedPosts from "../components/post/SuggestedPosts";
import SocialShareButtons from "../components/SocialShareButtons";
import {
  FaCalendarAlt, FaComments, FaCubes, FaHeart,
  FaPen, FaShareAlt, FaTrash, FaUser
} from "react-icons/fa";
import CommentForm from "../components/comment/CommentForm";
import Comments from "../components/comment/Comments";
import useSWR, { mutate } from 'swr';
import toast from "react-hot-toast";

const PostDetail = () => {
  const URL = process.env.REACT_APP_BASE_URL;
  const UPLOAD_URL = process.env.REACT_APP_UPLOAD_URL;

  const navigate = useNavigate();
  const { slug, post_id } = useParams();
  const [searchParams] = useSearchParams();
  const scrollToCommentId = searchParams.get('commentId');

  const user = JSON.parse(localStorage.getItem('user'));
  const user_id = user?._id;

  const [commentText, setCommentText] = useState('');

  const fetcher = (...args) =>
    fetch(...args, {
      headers: { Authorization: `Bearer ${user.token}` },
    }).then((res) => res.json());

  const { data: post, mutate: post_mutate, isLoading: post_isLoading } = useSWR(`${URL}/posts/${slug}`, fetcher);
  const { data: posts } = useSWR(`${URL}/posts?limit=3`, fetcher);
  const { data: comments, mutate: comments_mutate } = useSWR(`${URL}/comments/${post_id}?limit=1000`, fetcher);

  const imgPath = post?.data?.photo ? UPLOAD_URL + post.data.photo : samplePostImage;

  const gotoPostPage = () => navigate(`/`);

  const handleRemovePost = async (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to remove this post?')) {
      try {
        const resp = await fetch(`${URL}/posts/${slug}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        });
        const res = await resp.json();
        if (res.success) {
          toast.success(res.message);
          setTimeout(gotoPostPage, 3000);
        } else {
          toast.error(res.message);
        }
      } catch (err) {
        toast.error("Error while removing post");
        console.error(err);
      }
    }
  };

  const handleLikeUnlikePost = async () => {
    try {
      const response = await fetch(`${URL}/posts/like-and-unlike-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ user_id, post_id }),
      });
      const res = await response.json();
      if (res.success) {
        post_mutate();
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Error occurred while liking post");
      console.error(err);
    }
  };

  const commentOnPost = async (text, parentCommentId = null) => {
    try {
      const commentInfo = {
        comment: text,
        post_id,
        user_id,
        parentCommentId,
      };

      const response = await fetch(`${URL}/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(commentInfo),
      });

      const res = await response.json();
      if (res.success) {
        toast.success(res.message);
        setCommentText('');
        post_mutate();
        comments_mutate();
        const userProfileKey = `${URL}/auth/profile/${user_id}`;
        await mutate(userProfileKey);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Error occurred while commenting");
      console.error(err);
    }
  };

  const handleTopLevelComment = (text) => {
    if (!text.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    commentOnPost(text);
  };

  // ✅ Scroll to comment by ID if present in query
  useEffect(() => {
    if (scrollToCommentId) {
      setTimeout(() => {
        const element = document.getElementById(scrollToCommentId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add("bg-yellow-100", "transition");
          setTimeout(() => element.classList.remove("bg-yellow-100"), 3000);
        }
      }, 1000);
    }
  }, [comments, scrollToCommentId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      {post_isLoading ? (
        <PostCardSkeleton />
      ) : (
        <section className="container mx-auto max-w-5xl flex flex-col px-5 py-5 lg:flex-row lg:gap-x-5 lg:items-start mt-8">
          <article className="flex-1">
            <div className="img-div">
              <div className="flex justify-end items-center gap-2 mb-1">
                {user?._id === post?.data.author?._id && (
                  <>
                    <Link to={`/post/edit/${post?.data?.slug}`} className="blue-edit-btn">
                      <FaPen />
                    </Link>
                    <form onSubmit={handleRemovePost}>
                      <button type='submit' className='cate-delete-btn'><FaTrash /></button>
                    </form>
                  </>
                )}
              </div>

              <img
                className="rounded-2xl w-full !min-h-[60vh] !max-h-[60vh] object-cover"
                src={imgPath}
                alt={post?.data?.title}
              />
            </div>

            <div className="flex justify-between items-center my-3">
              <div className="flex items-center gap-1 text-dark-light text-sm">
                <FaUser className="text-red-600" /> {post?.data?.author?.name}
              </div>

              <div className="flex justify-end items-center gap-3.5 text-dark-light">
                <div className="flex items-center gap-1 text-sm cursor-pointer" onClick={handleLikeUnlikePost}>
                  <FaHeart className={`${post?.data?.likes?.includes(user_id) ? 'text-red-600' : 'text-gray-400'}`} /> {post?.data?.likes?.length}
                </div>

                <a href="#comment" className="flex items-center gap-1 text-sm cursor-pointer">
                  <FaComments /> {post?.data?.comments?.length}
                </a>

                <div className="flex items-center gap-0.5 text-sm">
                  <FaCalendarAlt />
                  {new Date(post?.data?.createdAt).getDate()}{" "}
                  {new Date(post?.data?.createdAt).toLocaleString("default", {
                    month: "long",
                  })}
                </div>
              </div>
            </div>

            <h1 className="flex justify-between items-center text-xl font-medium font-roboto mt-4 text-dark-hard md:text-[26px]">
              {post?.data?.title}
              <div className="flex items-center gap-1.5 text-dark-light">
                <FaCubes size={17} />
                <Link
                  to={`/blog?category=${post?.data?.categories?.name}`}
                  className="text-sm font-roboto inline-block md:text-base"
                >
                  {post?.data?.categories?.name}
                </Link>
              </div>
            </h1>

            <div className="w-full my-3 text-base text-dark-light">
              {!post_isLoading && post?.data?.body}
            </div>

            {/* ✅ Top-level comment form */}
            <CommentForm handleComment={handleTopLevelComment} />

            {/* ✅ Nested replies */}
            <Comments
              comments={comments?.comments || []}
              onAddReply={commentOnPost}
            />
          </article>

          <div>
            <SuggestedPosts
              header="Latest Articles"
              posts={posts?.posts}
              tags={posts?.posts?.categories}
              className="mt-8 lg:mt-0 lg:max-w-xs"
            />

            <div className="mt-7">
              <h2 className="font-roboto font-medium text-dark-light mb-4 md:text-[1rem] flex items-center gap-2">
                <FaShareAlt size={15} /> Share on
              </h2>

              <SocialShareButtons
                url={encodeURI(window.location.href)}
                title={encodeURIComponent(post?.data?.title)}
              />
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
};

export default PostDetail;
