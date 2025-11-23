import React from "react";

const Card3R = ({ title, desc, img }) => {
  return (
    <div className="w-[277px] h-[436px] hover:bg-[#005048] text-[#005048] hover:text-white text-center flex flex-col items-center gap-2 transition-all duration-500 shadow-2xl rounded-xl">
      <img
        className="w-[155px] h-[155px]"
        src={`/img/3R/${img}`}
        alt={title}
      />
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className=" text-sm max-w-[223px]">
        {desc}
      </p>
    </div>
  );
};

export default Card3R;
