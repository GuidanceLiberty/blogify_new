import { BsCalendar3, BsGrid3X3 } from "react-icons/bs";
import samplePostImage from '../../assets/images/sample.jpg';
import { Link, NavLink } from "react-router-dom";
import { FaCommentAlt, FaHeart, FaUserTie } from "react-icons/fa";
import toast from "react-hot-toast";
import { format } from 'timeago.js'; // ✅ imported here

const PostCard = ({ post, mutate, className }) => { 

  const userInfo = localStorage.getItem('user');
  const user = JSON.parse(userInfo);
  
  const user_id = user?._id;
  const post_id = post?._id;

  const URL = process.env.REACT_APP_BASE_URL;
  const imgURL = process.env.REACT_APP_UPLOAD_URL; 
  const imgPath = imgURL + post?.photo;  

  const handleLikeUnlikePost = () => {
    let answer = window.confirm('Are you sure you want to like / unlike post ?');
    if (answer) LikeUnlikePost();
  }

  const likeDetail = { user_id, post_id }

  const LikeUnlikePost = async () => {
    try {  
      const response = await fetch(`${URL}/posts/like-and-unlike-post`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(likeDetail),
      });
      const res = await response.json();
      if (res.success) {
        mutate();
        toast.success(res?.message);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Error occurred while liking post ");
      console.log("Error occurred while liking post ", err); 
    }
  }

  return (
    <div className={`rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all ease-in-out duration-[900ms] ${className}`}>
      <Link to={`/blog/${post?.slug}/${post?._id}`}>
        <img
          src={post.photo ? imgPath : samplePostImage}
          alt="title"
          className="w-full object-cover object-center h-auto md:h-52 lg:h-48 xl:h-60"
        />
      </Link>
      <div className="p-5">
        <div>
          <h2 className="font-roboto font-[500] text-lg text-dark-soft md:text-xl lg:text-[22px]">
            {post.title}
          </h2>

          <p className="py-1 line-clamp-1 text-sm">{post?.body.substring(0, 35)} ...</p>

          <div className="flex justify-between items-center">
            <NavLink to={`/category-post/${post?.categories?._id}`} className="text-dark-light mt-2 text-sm md:text-[1rem] flex items-center gap-1">
              <BsGrid3X3 className="w-3 h-3 text-blue-800 rounded-full" /> 
              {post?.categories ? post.categories?.name : 'No Category'}
            </NavLink>
            
            <div className="activities flex justify-end items-center gap-2">
              <div className="flex items-center gap-1 text-sm cursor-pointer" onClick={handleLikeUnlikePost}>
                <FaHeart className={`${post?.likes?.length > 0 ? 'text-red-600' : 'text-gray-400'}`} /> 
                {post?.likes?.length}
              </div>

              <div className="flex items-center gap-1 text-sm cursor-pointer">
                <FaCommentAlt className={`${post?.comments?.length > 0 ? 'text-red-600' : 'text-gray-400'}`} /> 
                {post?.comments?.length}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between flex-nowrap items-center mt-3">
          <div className="flex items-center gap-x-2 md:gap-x-2.5">
            {
              post?.author?.photo !== "" ?  
              <img src={ post?.author?.photo ? imgURL + post.author?.photo : '' } alt="profile photo"
                className="w-5 h-5 md:w-10 md:h-10 rounded-full" /> :
              <FaUserTie className="text-red-600" />
            }

            <div className="flex flex-col">
              <NavLink to={`/profile/${post.author._id}`} className="font-light italic text-dark-soft !text-sm md:text-base">
                {post.author.name}
              </NavLink>
            </div>
          </div>

          {/* ✅ Updated to show time ago */}
          <span className="font-extralight text-dark-light !text-sm md:text-base flex items-center gap-1">
            <BsCalendar3 className="w-3 h-4" />
            {format(post.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
