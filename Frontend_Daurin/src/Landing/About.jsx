import React, { useState } from "react";
import Bumi3d from "./components/Bumi3d";
import Bumi3dMobile from "./components/Bumi3dMobile";
import ReactCurvedText from "react-curved-text";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useTheme } from "../context/ThemeContext";

const About = () => {
  const [visi, setVisi] = useState(false)
  const { theme } = useTheme();

  const toggleVisi = () => {
    setVisi(true)    
  }

  const toggleMisi = () => {
    setVisi(false)    
  }

  return (
    <main className="relative" id="about">
      <Bumi3d />
      <Bumi3dMobile />
      <img
        src={`/img/${theme === "light" ? "svg.png" : "svg1.png"}`}
        className="absolute 2xl:-bottom-10 left-[50%] -translate-x-[50%] max-sm:w-screen max-sm:top-[35%]"
        alt=""
      />
      <div className="font-poppins relative z-30 flex flex-col justify-center items-center">
       <h1 className="text-2xl font-bold mb-6 toggleText">{visi ? "Visi" : "Misi"}</h1>
       <div className="relative w-screen flex flex-col justify-center items-center">
        <p className="max-w-[646px] text-center toggleText mx-15 max-sm:text-xs">{visi ? "Menjadikan Daurin sebagai platform digital yang menginspirasi dan memberdayakan masyarakat untuk mengubah sampah menjadi karya kreatif bernilai, melalui pemanfaatan teknologi, edukasi interaktif, dan komunitas yang peduli terhadap keberlanjutan lingkungan." : "Daurin berkomitmen untuk menyediakan AI Asisten Recy yang membantu mengenali jenis sampah dan memberikan ide daur ulang, menghadirkan game dan kuis interaktif sebagai sarana edukasi yang menyenangkan, serta membangun ruang komunitas bagi pengguna untuk berbagi karya dan saling menginspirasi. Melalui pengalaman yang kreatif dan inklusif, Daurin mendorong masyarakat untuk menerapkan gaya hidup ramah lingkungan dan mengolah sampah menjadi produk yang memiliki nilai estetika dan ekonomi."}</p>
       <IoIosArrowBack onClick={toggleVisi} className={`toggleText absolute top-[50%] z-50 left-[10%] max-sm:left-[5%] size-10 transition-all duration-200  ${visi ? "opacity-50 hover:size-10" : "opacity-100  hover:size-12"}`} />
       <IoIosArrowForward onClick={toggleMisi} className={`toggleText absolute top-[50%] z-50 right-[10%] max-sm:right-[5%] size-10 transition-all duration-200 ${visi ? "opacity-100 hover:size-12" : "opacity-50 hover:size-10"}`}/>

       </div>
      </div>
    </main>
  );
};

export default About;
