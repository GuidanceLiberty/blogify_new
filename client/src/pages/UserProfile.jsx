import React from "react";
import MainLayout from "../components/MainLayout";
import avatar from '../assets/images/user.png';
import useSWR from "swr";
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const { user_id } = useParams();

  const URL = process.env.REACT_APP_BASE_URL;
  const UPLOAD_URL = process.env.REACT_APP_UPLOAD_URL;

  const userInfo = localStorage.getItem('user');
  const user = userInfo ? JSON.parse(userInfo) : null;

  const fetcher = (...args) =>
    fetch(...args, {
      headers: { Authorization: `Bearer ${user?.token}` },
    }).then((res) => res.json());

  const { data: postsData, error: postsError } = useSWR(
    `${URL}/posts/user-posts/${user_id}?limit=2000`,
    fetcher
  );

  const { data: profileData, error: profileError } = useSWR(
    `${URL}/auth/profile/${user_id}`,
    fetcher
  );

  const posts = postsData?.data || [];
  const profile = profileData?.data;

  const profilePic =
    profile?.photo && profile?.photo !== "null"
      ? `${UPLOAD_URL}${profile.photo}`
      : avatar;

  if (postsError || profileError) {
    return (
      <MainLayout>
        <div className="text-center mt-20 text-red-500">
          Failed to load user profile. Please try again later.
        </div>
      </MainLayout>
    );
  }

  if (!postsData || !profileData) {
    return (
      <MainLayout>
        <div className="text-center mt-20 text-gray-600">
          Loading user profile...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="container mx-auto my-14 flex flex-col md:flex-row gap-10 items-center">
        {/* Profile Image */}
        <div className="md:w-1/3 flex justify-center">
          <img
            src={profilePic}
            alt="Profile"
            className="w-[200px] h-[200px] object-cover rounded-full shadow-lg"
          />
        </div>

        {/* Profile Info Table */}
        <table className="w-full md:w-2/3 rounded-lg border shadow">
          <tbody>
            {[
              ["Username", profile?.name],
              ["Email", profile?.email],
              ["Role", profile?.role],
              ["Last Login", profile?.lastLogin
                ? new Date(profile.lastLogin).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
                : "Not available"],
              ["No of Posts", posts.length],
              ["No of Liked Posts", profile?.likes?.length || 0],
              ["No of Comments", profile?.noOfComments || 0],
              ["Is Verified", profile?.isVerified ? "Yes" : "No"],
              ["Joined on", profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
                : "Unknown"]
            ].map(([label, value], idx) => (
              <tr
                key={label}
                className={`tracking-wider ${idx % 2 !== 0 ? 'bg-gray-100' : ''}`}
              >
                <td className="px-4 py-2 font-semibold text-right border-r border-gray-300 w-1/2">
                  {label}
                </td>
                <td className="px-4 py-2 text-left">
                  {label === "Is Verified" ? (
                    value === "Yes" ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-500 font-semibold">No</span>
                    )
                  ) : value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </MainLayout>
  );
};

export default UserProfile;
