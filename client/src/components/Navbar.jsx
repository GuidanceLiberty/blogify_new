import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { navItems } from '../constants';
import { FaPowerOff, FaUserAlt, FaUserTie, FaBell } from 'react-icons/fa';
import { RiMenu4Line } from '@remixicon/react';
import toast from "react-hot-toast";
import { useState } from 'react';
import useSWR, { mutate } from 'swr';

const Navbar = ({ showMenu, setShowMenu }) => {
  const URL = process.env.REACT_APP_BASE_URL;
  const UPLOAD_URL = process.env.REACT_APP_UPLOAD_URL;
  const navigate = useNavigate();

  // Get user from localStorage
  let user = localStorage.getItem('user');
  user = user ? JSON.parse(user) : null;
  const profilePic = user?.photo ? `${UPLOAD_URL}/${user.photo}` : null;

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  const redirectToLogin = () => navigate('/login');

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('user');
      toast.success("Logging out...");
      setTimeout(redirectToLogin, 3000);
    }
  };

  // Fetch notifications
  const fetcher = (url) =>
    fetch(url, {
      headers: user ? { Authorization: `Bearer ${user.token}` } : {},
    }).then((res) => res.json());

  const { data } = useSWR(
    user?._id ? `${URL}/notifications/${user._id}` : null,
    fetcher,
    { refreshInterval: 10000 }
  );

  const notifications = data?.notifications || [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleBellClick = async () => {
    setShowNotificationDropdown((prev) => !prev);
    setShowUserDropdown(false);

    if (unreadCount > 0) {
      try {
        await fetch(`${URL}/notifications/mark-as-read/${user?._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        });
        mutate(`${URL}/notifications/${user._id}`);
      } catch (err) {
        console.error("Error marking notifications as read", err);
        toast.error("Failed to mark notifications as read");
      }
    }
  };

  const handleProfileClick = () => {
    setShowUserDropdown((prev) => !prev);
    setShowNotificationDropdown(false);
  };

  return (
    <section className='fixed bg-white w-full mx-auto px-5 min-h-[3rem] py-1 z-30'>
      <nav className='flex justify-between items-center px-1 lg:px-[5rem]'>

        {/* 🔗 Logo */}
        <NavLink to="/" className="logo py-3 flex items-center gap-1">
          <img src={logo} alt="logo" className='w-8 h-7' />
          <span className='font-semibold text-lg'>BLOGIFY</span>
        </NavLink>

        <div className="nav-links flex items-center gap-4">

          {/* 🧭 Menu */}
          {navItems.map((item) => (
            <Link key={item.name} className="link" to={item.href}>
              <div className="flex items-center gap-1.5 !text-primary">{item.icon} {item.name}</div>
            </Link>
          ))}

          {/* 🔔 Bell */}
          {user && (
            <div className="relative cursor-pointer" onClick={handleBellClick}>
              <FaBell className='text-gray-600 text-[18px]' />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-[6px] py-[1px] rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          )}

          {/* 👤 Profile */}
          {user && (
            <div className="cursor-pointer" onClick={handleProfileClick}>
              {profilePic
                ? <img src={profilePic} className='w-5 h-5 rounded-full object-cover' alt="profile" />
                : <FaUserTie />}
            </div>
          )}

          {/* 📱 Hamburger */}
          <div className="md:hidden cursor-pointer" onClick={() => setShowMenu(!showMenu)}>
            <RiMenu4Line />
          </div>
        </div>
      </nav>

      {/* 👤 User Dropdown */}
      {showUserDropdown && user && (
        <div className="mobile-menu-div">
          <NavLink to={`/profile/${user._id}`} className="flex items-center gap-2">
            <FaUserAlt className='text-primary' /> {user.name}
          </NavLink>
          <NavLink to="/notifications" className="flex items-center gap-2">
            <FaBell className='text-primary' /> Notifications
          </NavLink>
          <button className='flex items-center gap-2' onClick={handleLogout}>
            <FaPowerOff className='text-red-500' /> Logout
          </button>
        </div>
      )}

      {/* 🔔 Notification Dropdown */}
      {showNotificationDropdown && user && (
        <div className="absolute top-[3.5rem] right-5 w-[280px] bg-white shadow-md rounded-md z-40 max-h-[300px] overflow-y-auto">
          <div className="p-3 border-b font-semibold">Notifications</div>
          {notifications.length === 0 ? (
            <div className="p-3 text-gray-500 text-sm">No notifications</div>
          ) : (
            notifications.map((notif) => (
              <div key={notif._id} className="p-3 border-b hover:bg-gray-50 text-sm">
                <span className="font-semibold">{notif.sender?.name}</span>: {notif.message}
              </div>
            ))
          )}
          <Link to="/notifications" className="block text-center py-2 text-blue-500 hover:underline">
            View All
          </Link>
        </div>
      )}

      {/* 📱 Mobile Links */}
      <div className="nav-links dropdown-div">
        {showMenu && navItems.map((item) => (
          <Link key={item.name} className="first:pt-4 last:pb-5 flex items-center gap-2 !text-primary" to={item.href}>
            {item.mobileIcon} {item.name}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Navbar;
