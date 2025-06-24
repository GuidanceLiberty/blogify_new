import { useEffect, useState } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { redirect, useNavigate } from "react-router-dom";

const MainLayout = ({ children }) => {


  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const userInfo = localStorage.getItem('user');
  const user = JSON.parse(userInfo);
  const url = "http://localhost:3000/login";

  useEffect(() => {
    if(user === undefined || user === '' || user === null){
      return navigate(`/login`); 
    }
  }, [])

  return (
    <main className="">
      <div className="min-h-[2.5rem] mb-2 z-40 shadow-lg">
        <Navbar showMenu={showMenu} setShowMenu={setShowMenu} showDropdown={showDropdown} setShowDropdown={setShowDropdown} />
      </div>
      
      <div className="" onClick={() => [setShowMenu(false), setShowDropdown(false)] }>
        {children}
      </div>
      
      <Footer />
    </main>
  );
};

export default MainLayout;
