import { FaCubes, FaFeather, FaHeart, FaHome, FaPen } from "react-icons/fa"

export const navItems = [
    { name: "Home", type: "link", href: "/", icon: <FaHome className="text-red-500" />, mobileIcon: <FaHome className="text-gray-700" /> },
    { name: "Blog", type: "link", href: "/blog", icon: <FaFeather className="text-red-500" />, mobileIcon: <FaFeather className="text-gray-700" /> },
    { name: "Post", type: "link", href: "/post/create", icon: <FaPen className="text-red-500" />, mobileIcon: <FaPen className="text-gray-700" /> },
    { name: "Categories", type: "link", href: "/categories", icon: <FaCubes className="text-red-500" />, mobileIcon: <FaCubes className="text-gray-700" /> },
    { name: "Likes", type: "link", href: "/likes", icon: <FaHeart className="text-red-500" />, mobileIcon: <FaHeart className="text-gray-700" /> },
  ];
