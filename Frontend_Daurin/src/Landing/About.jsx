import React, { useState } from "react";
import Bumi3d from "./components/Bumi3d";
import ReactCurvedText from "react-curved-text";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const About = () => {
  const [visi, setVisi] = useState(false)

  const toggleVisi = () => {
    setVisi(true)    
  }

  const toggleMisi = () => {
    setVisi(false)    
  }

  return (
    <main className="relative">
      <Bumi3d />
      <img
        src="/img/svg.png"
        className="absolute bottom-20 left-[50%] -translate-x-[50%]"
        alt=""
      />
      <div className="font-poppins relative z-30 flex flex-col justify-center items-center">
       <h1 className="text-2xl font-bold mb-6">{visi ? "Visi" : "Misi"}</h1>
       <div className="relative w-screen flex flex-col justify-center items-center">
        <p className="max-w-[646px] text-center">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Possimus deserunt asperiores, temporibus delectus nobis magnam! Qui nisi et porro modi voluptas, perferendis, incidunt hic cum ad non culpa velit quidem!
       Illum libero est vitae eum blanditiis doloribus dolore illo laudantium in nostrum repellendus esse eligendi quas, distinctio natus! Perferendis doloremque distinctio recusandae tempora veniam deserunt error quos hic, commodi architecto!
       Sed fuga saepe doloribus voluptatibus consequatur eius rerum illum distinctio quidem dolores veniam, magnam suscipit ad. Accusamus, quos nihil non voluptas ratione voluptatum dolores quo esse quas beatae natus eos?
       Doloremque quae natus officia neque suscipit odio omnis, laborum corporis deserunt ad nemo mollitia voluptatibus excepturi, sunt, eaque beatae fugiat sed explicabo veritatis! Ullam deserunt ex quidem nam, ipsam suscipit.</p>
       <IoIosArrowBack onClick={toggleVisi} className={`absolute top-[50%] z-50 left-[10%] size-10 transition-all duration-200  ${visi ? "opacity-50 hover:size-10" : "opacity-100  hover:size-12"}`} />
       <IoIosArrowForward onClick={toggleMisi} className={`absolute top-[50%] z-50 right-[10%] size-10 transition-all duration-200 ${visi ? "opacity-100 hover:size-12" : "opacity-50 hover:size-10"}`}/>

       </div>
      </div>
    </main>
  );
};

export default About;
