import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";

const Cube = () => {
  const ref = useRef();
  const bumiTexture = useLoader(THREE.TextureLoader, "/texture/bumi3.png");

  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.3;
  });

  return (
    <mesh position={[0, 0, 0]} ref={ref}>
      <sphereGeometry args={[2, 128, 128]} />
      <meshStandardMaterial map={bumiTexture} />
    </mesh>
  );
};

const Bumi3d = () => {
  return (
    <section className="relative w-screen h-screen max-sm:hidden ">
      <Canvas>
        <directionalLight position={[0, 0, 2]} />
        <ambientLight />
        <Cube></Cube>
      </Canvas>
      <div
        className="
    absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]
    w-[600px] h-[600px] -z-10 rounded-full
    bg-[radial-gradient(circle_at_center,#00796D_45%,rgba(0,121,109,0)_70%)]
  "
      ></div>
    </section>
  );
};

export default Bumi3d;
