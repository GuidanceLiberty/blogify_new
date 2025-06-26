import { useState } from 'react';
import { FaRegCalendarAlt, FaReply } from 'react-icons/fa';
import userImg from '../../assets/images/user.png';
import CommentForm from './CommentForm';

const Comments = ({ comments = [], onAddReply }) => {
  const [replyingTo, setReplyingTo] = useState(null);
  const img_path = process.env.REACT_APP_UPLOAD_URL;

  const toggleReplyForm = (commentId) => {
    setReplyingTo((prev) => (prev === commentId ? null : commentId));
  };

  // Group comments by parent
  const commentMap = {};
  comments.forEach((comment) => {
    const parentId = comment.parentCommentId || 'root';
    if (!commentMap[parentId]) {
      commentMap[parentId] = [];
    }
    commentMap[parentId].push(comment);
  });

  const renderComments = (parentId = 'root', level = 0) => {
    return (
      commentMap[parentId]?.map((comment) => {
        const replies = commentMap[comment._id] || [];

        return (
          <div
            key={comment._id}
            id={comment._id}
            className={`mb-4 border-l-2 border-gray-200`}
            style={{ paddingLeft: `${Math.min(level * 24, 96)}px` }}
          >
            <div className="comment-div">
              <div className="comment-user-info">
                <div className="user-img">
                  <img
                    src={comment?.author?.photo ? img_path + comment?.author?.photo : userImg}
                    alt="user"
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div className="user-info">
                  <span>{comment?.author?.name}</span>
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <FaRegCalendarAlt />
                    {new Date(comment?.createdAt).getDate()}{" "}
                    {new Date(comment?.createdAt).toLocaleString("default", {
                      month: "long",
                    })}
                  </div>
                </div>
              </div>

              {/* "Replying to X" display if this is a reply */}
              {comment?.parentCommentId && comment?.parentAuthorName && (
                <div className="text-xs text-gray-500 mb-1 italic">
                  Replying to{" "}
                  <span className="font-semibold text-purple-700">
                    {comment.parentAuthorName}
                  </span>
                </div>
              )}

              <p className="comment-content">{comment?.comment}</p>

              <button
                className="text-sm text-purple-700 font-medium mt-1 flex items-center gap-1"
                onClick={() => toggleReplyForm(comment._id)}
              >
                <FaReply /> Reply
              </button>

              {replyingTo === comment._id && (
                <CommentForm
                  parentCommentId={comment._id}
                  replyingToName={comment?.author?.name}
                  handleComment={onAddReply}
                />
              )}
            </div>

            {/* Recursive render of replies */}
            {renderComments(comment._id, level + 1)}
          </div>
        );
      }) || null
    );
  };

  return <section className="mt-6">{renderComments()}</section>;
};

export default Comments;
