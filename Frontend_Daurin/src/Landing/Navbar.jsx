import { FaArrowRightLong } from "react-icons/fa6";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav>
      <nav
        className="flex flex-row justify-between items-center 
                   w-[95%] max-w-[1312px] h-[70px] md:h-[80px] z-50 fixed
                   top-4 md:top-10 left-[50%] -translate-x-[50%] 
                   px-4 md:px-10 rounded-full
                   border border-white/20
                   bg-white/10
                   backdrop-blur-2xl
                   shadow-[0_18px_60px_rgba(0,0,0,0.35)] toggleText"
      >
        <div className="flex items-center gap-2 md:gap-3">
          <img 
            className="w-[45px] h-[45px] md:w-[60px] md:h-[60px]" 
            src={`/img/${theme === "light" ? "logo.png" : "logo-dark.png"}`} 
            alt="LOGO" 
          />
          <h1 className="font-bold text-xl md:text-3xl toggleTextTitle">Daurin</h1>
        </div>
        <div className="hidden lg:block">
          <ul className="flex gap-5">
            <li>
              <a href="#home" className="transition hover:opacity-70">
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="transition hover:opacity-70">
                About
              </a>
            </li>
            <li>
              <a href="#edukasi" className="transition hover:opacity-70">
                Edukasi
              </a>
            </li>
            <li>
              <a href="#recy" className="transition hover:opacity-70">
                Recy
              </a>
            </li>
          </ul>
        </div>

        <div className="hidden lg:block">
          {user ? (
            <Link to="/dashboard">
              <button className="rounded-xl cursor-pointer hover:scale-105 duration-150 rounded-r-3xl toggleButton toggleTextButton bg-[#00796D] px-4 py-2 text-white flex items-center gap-3 shadow-md hover:bg-[#019887] transition">
                Dashboard <FaArrowRightLong />
              </button>
            </Link>
          ) : (
            <Link to="/login">
              <button className="rounded-xl cursor-pointer hover:scale-105 duration-150 rounded-r-3xl toggleButton toggleTextButton bg-[#00796D] px-4 py-2 text-white flex items-center gap-3 shadow-md hover:bg-[#019887] transition">
                Login <FaArrowRightLong />
              </button>
            </Link>
          )}
        </div>

        <button
          onClick={toggleMenu}
          className="lg:hidden text-2xl md:text-3xl toggleText z-50"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </nav>

      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={toggleMenu}
        >
          <div
            className="fixed top-[90px] md:top-[110px] right-4 
                       w-[calc(100%-2rem)] max-w-[300px]
                       bg-white/10 backdrop-blur-2xl
                       border border-white/20 rounded-3xl
                       shadow-[0_18px_60px_rgba(0,0,0,0.35)]
                       p-6 toggleText"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="flex flex-col gap-4 mb-6">
              <li>
                <a
                  href="#home"
                  className="block py-2 transition hover:opacity-70"
                  onClick={toggleMenu}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="block py-2 transition hover:opacity-70"
                  onClick={toggleMenu}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#edukasi"
                  className="block py-2 transition hover:opacity-70"
                  onClick={toggleMenu}
                >
                  Edukasi
                </a>
              </li>
              <li>
                <a
                  href="#recy"
                  className="block py-2 transition hover:opacity-70"
                  onClick={toggleMenu}
                >
                  Recy
                </a>
              </li>
            </ul>
            {user ? (
              <Link to="/">
                <button className="w-full rounded-xl rounded-r-3xl toggleButton toggleTextButton bg-[#00796D] px-4 py-3 text-white flex items-center justify-center gap-3 shadow-md hover:bg-[#019887] transition">
                  Dashboard <FaArrowRightLong />
                </button>
              </Link>
            ) : (
              <Link to="/login">
                <button className="w-full rounded-xl rounded-r-3xl toggleButton toggleTextButton bg-[#00796D] px-4 py-3 text-white flex items-center justify-center gap-3 shadow-md hover:bg-[#019887] transition">
                  Login <FaArrowRightLong />
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
