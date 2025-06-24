import MainLayout from "../components/MainLayout";
import avatar from '../assets/images/user.png';
import useSWR from "swr";
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const URL = process.env.REACT_APP_BASE_URL;
  const UPLOAD_URL = process.env.REACT_APP_UPLOAD_URL;

  const userInfo = localStorage.getItem('user');
  const user = JSON.parse(userInfo);

  const { user_id } = useParams();

  const fetcher = (...args) =>
    fetch(...args, {
      headers: { Authorization: `Bearer ${user.token}` },
    }).then((res) => res.json());

  const { data: postsData, error: postsError } = useSWR(`${URL}/posts/user-posts/${user_id}?limit=2000`, fetcher);
  const { data: profileData, error: profileError } = useSWR(`${URL}/auth/profile/${user_id}`, fetcher);

  const posts = postsData?.data || [];
  const profile = profileData?.data;

  const profilePic =
    profile?.photo && profile?.photo !== "null"
      ? UPLOAD_URL + profile.photo
      : avatar;

  const totalComments = posts?.reduce((acc, post) => acc + (post.comments?.length || 0), 0);

  if (postsError || profileError) {
    return (
      <MainLayout>
        <div className="text-center mt-20 text-red-500">
          Failed to load user profile. Please try again later.
        </div>
      </MainLayout>
    );
  }

  if (!profileData || !postsData) {
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
      <section className="container mx-auto my-14 sm:flex-row md:flex sm:items-center md:justify-start items-center gap-24">
        <div className="profile-image sm:w-full md:w-5/7 flex justify-center text-center">
          <img src={profilePic} alt="Profile" className="w-[50vw]" />
        </div>

        <table className="w-full rounded-lg">
          <tbody>
            <tr className="whitespace-nowrap bg-gray-200 tracking-wider">
              <td className="pr-5 py-2 text-lg font-semibold text-right border-r-2 border-gray-300">Username</td>
              <td className="pl-5 py-2 text-lg">{profile?.name}</td>
            </tr>
            <tr className="whitespace-nowrap tracking-wider">
              <td className="pr-5 py-2 text-lg font-semibold text-right border-r border-gray-300">Email</td>
              <td className="pl-5 py-2 text-lg">{profile?.email}</td>
            </tr>
            <tr className="whitespace-nowrap bg-gray-200 tracking-wider">
              <td className="pr-5 py-2 text-lg font-semibold text-right border-r-2 border-gray-300">Role</td>
              <td className="pl-5 py-2 text-lg">{profile?.role}</td>
            </tr>
            <tr className="whitespace-nowrap tracking-wider">
              <td className="pr-5 py-2 text-lg font-semibold text-right border-r border-gray-300">Last Login</td>
              <td className="pl-5 py-2 text-lg">
                {profile?.lastLogin
                  ? new Date(profile.lastLogin).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Not available"}
              </td>
            </tr>
            <tr className="whitespace-nowrap bg-gray-200 tracking-wider">
              <td className="pr-5 py-2 text-lg font-semibold text-right border-r-2 border-gray-300">No of Posts</td>
              <td className="pl-5 py-2 text-lg">{posts.length}</td>
            </tr>
            <tr className="whitespace-nowrap tracking-wider">
              <td className="pr-5 py-2 text-lg font-semibold text-right border-r border-gray-300">No of Liked Posts</td>
              <td className="pl-5 py-2 text-lg">{profile?.likes?.length || 0}</td>
            </tr>
            <tr className="whitespace-nowrap bg-gray-200 tracking-wider">
              <td className="pr-5 py-2 text-lg font-semibold text-right border-r-2 border-gray-300">No of Comments</td>
              <td className="pl-5 py-2 text-lg">{profile?.noOfComments || 0}</td>

            </tr>
            <tr className="whitespace-nowrap tracking-wider">
              <td className="pr-5 py-2 text-lg font-semibold text-right border-r border-gray-300">Is Verified</td>
              <td className="pl-5 py-2 text-lg">
                {profile?.isVerified ? (
                  <span className="text-green-600 font-semibold">Yes</span>
                ) : (
                  <span className="text-red-500 font-semibold">No</span>
                )}
              </td>
            </tr>
            <tr className="whitespace-nowrap bg-gray-200 tracking-wider">
              <td className="pr-5 py-2 text-lg font-semibold text-right border-r-2 border-gray-300">Joined on</td>
              <td className="pl-5 py-2 text-lg">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Unknown"}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </MainLayout>
  );
};

export default UserProfile;
