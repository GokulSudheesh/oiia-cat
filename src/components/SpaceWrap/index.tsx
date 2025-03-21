import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";

type Props = {};

const SpaceWrap = (props: Props) => {
  return (
    <>
      <Canvas
        camera={{
          fov: 100,
          near: 0.1,
          far: 200,
          // position: [15, 5, 5],
        }}
      >
        {/* <Perf /> */}
        <Scene />
      </Canvas>
    </>
  );
};

export default SpaceWrap;
