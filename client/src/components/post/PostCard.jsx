import { BsCalendar3, BsGrid3X3 } from "react-icons/bs";
import samplePostImage from '../../assets/images/sample.jpg';
import { Link, NavLink } from "react-router-dom";
import { FaCommentAlt, FaHeart, FaUserTie } from "react-icons/fa";
import toast from "react-hot-toast";
import { format } from 'timeago.js';

const PostCard = ({ post, mutate, className }) => {
  const userInfo = localStorage.getItem('user');
  const user = userInfo ? JSON.parse(userInfo) : null;

  const user_id = user?._id;
  const post_id = post?._id;

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const UPLOAD_URL = process.env.REACT_APP_UPLOAD_URL;

  // ✅ Ensure no double slashes
  const imgPath = post?.photo
    ? `${UPLOAD_URL.replace(/\/$/, '')}/${post.photo.replace(/^\//, '')}`
    : samplePostImage;

  const handleLikeUnlikePost = () => {
    if (!user) {
      toast.error("Login required to like/unlike a post");
      return;
    }

    const confirm = window.confirm('Are you sure you want to like/unlike this post?');
    if (confirm) {
      likeOrUnlike();
    }
  };

  const likeOrUnlike = async () => {
    try {
      const res = await fetch(`${BASE_URL}/posts/like-and-unlike-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ user_id, post_id })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        mutate(); // refetch posts
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to update like");
      console.error("Like error:", err);
    }
  };

  return (
    <div className={`rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all ease-in-out duration-700 ${className}`}>
      <Link to={`/blog/${post?.slug}/${post?._id}`}>
        <img
          src={imgPath}
          alt="Post"
          className="w-full object-cover object-center h-auto md:h-52 lg:h-48 xl:h-60"
        />
      </Link>
      <div className="p-5">
        <h2 className="font-roboto font-medium text-lg text-dark-soft md:text-xl lg:text-[22px]">
          {post?.title}
        </h2>

        <p className="py-1 line-clamp-1 text-sm">{post?.body?.slice(0, 35)}...</p>

        <div className="flex justify-between items-center">
          <NavLink
            to={`/category-post/${post?.categories?._id}`}
            className="text-dark-light mt-2 text-sm flex items-center gap-1"
          >
            <BsGrid3X3 className="w-3 h-3 text-blue-800" />
            {post?.categories?.name || 'No Category'}
          </NavLink>

          <div className="activities flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm cursor-pointer" onClick={handleLikeUnlikePost}>
              <FaHeart className={post?.likes?.length > 0 ? 'text-red-600' : 'text-gray-400'} />
              {post?.likes?.length || 0}
            </div>

            <div className="flex items-center gap-1 text-sm">
              <FaCommentAlt className={post?.comments?.length > 0 ? 'text-red-600' : 'text-gray-400'} />
              {post?.comments?.length || 0}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-x-2">
            {post?.author?.photo ? (
              <img
                src={`${UPLOAD_URL.replace(/\/$/, '')}/${post.author.photo.replace(/^\//, '')}`}
                alt="profile"
                className="w-5 h-5 md:w-10 md:h-10 rounded-full"
              />
            ) : (
              <FaUserTie className="text-red-600" />
            )}

            <NavLink to={`/profile/${post?.author?._id}`} className="italic text-sm md:text-base">
              {post?.author?.name}
            </NavLink>
          </div>

          <span className="text-sm text-dark-light flex items-center gap-1">
            <BsCalendar3 className="w-3 h-4" />
            {format(post?.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
