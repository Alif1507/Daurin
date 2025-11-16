import React from "react";
import Bumi3d from "./components/Bumi3d";
import ReactCurvedText from "react-curved-text";

const About = () => {
  return (
    <main className="relative">
      <Bumi3d />
      <img
        src="/img/svg.png"
        className="absolute -bottom-50 left-[50%] -translate-x-[50%]"
        alt=""
      />
      <div className="absolute z-30 top-[57%] left-1/2 -translate-x-1/2 -translate-y-1/2">
        <ReactCurvedText
          width={420}
          height={260}
          cx={230} // posisi pusat ellipse X
          cy={30} // makin gede -> ellipse turun ke bawah
          rx={600} // radius lebih gede = curve lebih landai
          ry={190}
          startOffset="25%" // mulai dari tengah
          reversed={false}
          text="ABOUT OUR VISION MISION"
          textProps={{
            style: {
              fontSize: 50,
              letterSpacing: "8px", // renggang
              fontWeight: 600,
              fill: "#00796D",
            },
          }}
          textPathProps={{ textAnchor: "middle" }}
          ellipseProps={null}
          svgProps={{ style: { overflow: "visible" } }}
        />
      </div>
    </main>
  );
};

export default About;
