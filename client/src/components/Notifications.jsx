import React, { useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import MainLayout from '../components/MainLayout';
import useSWR from 'swr';
import { Link } from 'react-router-dom';
import avatar from '../assets/images/user.png';

const Notifications = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const URL = process.env.REACT_APP_BASE_URL;
  const IMG = process.env.REACT_APP_UPLOAD_URL;

  const fetcher = (url) =>
    fetch(url, {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    }).then((res) => res.json());

  const { data, error, isLoading, mutate } = useSWR(
    user?._id ? `${URL}/notifications/${user._id}` : null,
    fetcher
  );

  useEffect(() => {
    window.scrollTo(0, 0);

    const markAsRead = async () => {
      try {
        await fetch(`${URL}/notifications/mark-as-read/${user?._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`,
          },
        });

        mutate(); // Revalidate notification list
      } catch (err) {
        console.error('Failed to mark notifications as read:', err);
      }
    };

    if (user?._id) {
      markAsRead();
    }
  }, [URL, user?._id, user?.token, mutate]);

  if (error)
    return (
      <MainLayout>
        <div className="text-red-500 p-4">Failed to load notifications.</div>
      </MainLayout>
    );

  if (isLoading)
    return (
      <MainLayout>
        <div className="p-4">Loading notifications...</div>
      </MainLayout>
    );

  const notifications = data?.notifications || [];

  return (
    <MainLayout>
      <section className="max-w-3xl mx-auto px-5 py-6">
        <h1 className="text-xl font-semibold flex items-center gap-2 text-purple-700 mb-6">
          <FaBell /> Notifications
        </h1>

        {notifications.length === 0 ? (
          <p className="text-gray-500 text-sm">You have no notifications.</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((note) => (
              <li
                key={note._id}
                className="bg-white p-4 rounded-md shadow border border-gray-100 flex items-start gap-3"
              >
                <img
                  src={
                    note?.sender?.photo
                      ? `${IMG}/${note.sender.photo}`
                      : avatar
                  }
                  alt="Sender"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col text-sm text-dark-hard">
                  <span className="font-medium">{note.sender?.name}</span>
                  <span>{note.message}</span>

                  {note.postId && (
                    <Link
                      to={
                        note.slug
                          ? `/blog/${note.slug}/${note.postId}${
                              note.commentId ? `?commentId=${note.commentId}` : ''
                            }`
                          : `/blog/post/${note.postId}${
                              note.commentId ? `?commentId=${note.commentId}` : ''
                            }`
                      }
                      className="text-purple-600 text-xs mt-1 underline"
                    >
                      View post
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </MainLayout>
  );
};

export default Notifications;
