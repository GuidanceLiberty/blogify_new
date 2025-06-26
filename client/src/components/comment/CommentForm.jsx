import { useState } from 'react';
import { FaComment } from 'react-icons/fa';

const CommentForm = ({ handleComment, parentCommentId = null, replyingToName = null }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;

    handleComment(trimmed, parentCommentId);
    setCommentText('');
  };

  return (
    <section className="w-full my-6">
      <form onSubmit={handleSubmit} className="flex flex-col w-full">
        <label htmlFor="comment" className="label justify-between">
          <div className="label !text-lg flex items-center gap-1">
            <FaComment />
            {parentCommentId ? "Reply" : "Comment"}
          </div>
          <button type="submit" className="btn-purple-full">
            {parentCommentId ? "Post Reply" : "Post Comment"}
          </button>
        </label>

        {replyingToName && (
          <div className="text-sm text-gray-500 mb-1 italic">
            Replying to <span className="text-purple-700 font-semibold">{replyingToName}</span>
          </div>
        )}

        <textarea
          rows={3}
          id="comment"
          placeholder={parentCommentId ? "Write your reply..." : "Write your comment..."}
          className="placeholder:text-[#bec6d3] placeholder:font-light text-input-reg !font-light"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        ></textarea>
      </form>
    </section>
  );
};

export default CommentForm;
