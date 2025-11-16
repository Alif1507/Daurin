import { FaArrowRightLong } from "react-icons/fa6";

const Navbar = () => {
  return (
   <nav>
     <nav
       className="flex flex-row justify-between items-center w-[1312px] h-[80px] z-50 fixed
                  top-10 left-[50%] -translate-x-[50%] px-10 rounded-full
                  border border-white/20
                  bg-white/10
                  backdrop-blur-2xl
                  shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
     >
      <div className="flex items-center gap-3">
        <img className="w-[60px] h-[60px]" src="/img/logo.png" alt="LOGO" />
        <h1 className="font-bold text-3xl text-[#22311D]">Daurin</h1>
      </div>

      <div>
        <ul className="flex gap-5">
          <li>
            <a href="#home" className="transition">
              Home
            </a>
          </li>
          <li>
            <a href="#about" className="transition">
              About
            </a>
          </li>
          <li>
            <a href="#contact" className="transition">
              Contact
            </a>
          </li>
          <li>
            <a href="#faq" className="transition">
              FAQ
            </a>
          </li>
        </ul>
      </div>

      <div>
        <button className="rounded-xl rounded-r-3xl bg-[#00796D] px-4 py-2 text-white flex items-center gap-3 shadow-md hover:bg-[#019887] transition">
          Signin <FaArrowRightLong />
        </button>
      </div>
    </nav>
   </nav>
  );
};

export default Navbar;
