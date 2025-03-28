// Credit: https://github.com/o2bomb/space-warp
import { useFrame } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
} from "@react-three/postprocessing";
import { BlendFunction, ChromaticAberrationEffect } from "postprocessing";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  ACCELERATE_EVENT_NAME,
  DECELERATE_EVENT_NAME,
} from "../../utils/constants";

export interface SceneProps {
  isAccelerating?: boolean;
}

const COUNT = 100;
const XY_BOUNDS = 40;
const Z_BOUNDS = 20;
const MAX_SPEED_FACTOR = 2;
const MAX_SCALE_FACTOR = 50;
const MAX_VEL = 0.4;
const MIN_VEL = 0.05;
const ACC = 0.025;

const CHROMATIC_ABBERATION_OFFSET = 0.007;

export const Scene = ({}: SceneProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const effectsRef = useRef<ChromaticAberrationEffect>(null);
  const isAccelerating = useRef(false);

  const handleAccelerate = () => {
    console.log("[LOG] Accelerating");
    isAccelerating.current = true;
  };
  const handleDecelerate = () => {
    console.log("[LOG] Decelerating");
    isAccelerating.current = false;
  };

  useEffect(() => {
    window.addEventListener(ACCELERATE_EVENT_NAME, handleAccelerate);
    window.addEventListener(DECELERATE_EVENT_NAME, handleDecelerate);

    return () => {
      window.removeEventListener(ACCELERATE_EVENT_NAME, handleAccelerate);
      window.removeEventListener(DECELERATE_EVENT_NAME, handleDecelerate);
    };
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;

    const t = new THREE.Object3D();
    let j = 0;
    for (let i = 0; i < COUNT * 3; i += 3) {
      t.position.x = generatePos();
      t.position.y = generatePos();
      t.position.z = (Math.random() - 0.5) * Z_BOUNDS;
      t.updateMatrix();
      meshRef.current.setMatrixAt(j++, t.matrix);
    }
  }, []);

  const temp = new THREE.Matrix4();
  const tempPos = new THREE.Vector3();
  const tempObject = new THREE.Object3D();
  const tempColor = new THREE.Color();
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // https://www.wolframalpha.com/input?i=1%2F%28x%5Ex%29

    const velocity = Math.max(
      Math.min(
        MIN_VEL +
          ACC * state.clock.elapsedTime * (isAccelerating.current ? 1 : -1),
        MAX_VEL
      ),
      MIN_VEL
    );
    // console.log("[LOG]", { velocity });
    for (let i = 0; i < COUNT; i++) {
      meshRef.current.getMatrixAt(i, temp);

      // update scale
      tempObject.scale.set(1, 1, Math.max(1, velocity * MAX_SCALE_FACTOR));

      // update position
      tempPos.setFromMatrixPosition(temp);
      if (tempPos.z > Z_BOUNDS / 2) {
        tempPos.z = -Z_BOUNDS / 2;
      } else {
        tempPos.z += Math.max(delta, velocity * MAX_SPEED_FACTOR);
      }
      tempObject.position.set(tempPos.x, tempPos.y, tempPos.z);

      // apply transforms
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);

      // update and apply color
      if (tempPos.z > 0) {
        tempColor.r = tempColor.g = tempColor.b = 1;
      } else {
        tempColor.r =
          tempColor.g =
          tempColor.b =
            1 - tempPos.z / (-Z_BOUNDS / 2);
      }
      meshRef.current.setColorAt(i, tempColor);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor)
      meshRef.current.instanceColor.needsUpdate = true;

    // update post processing uniforms
    if (!effectsRef.current) return;
    effectsRef.current.offset.x = Math.max(
      0,
      Math.pow(0.5, state.clock.elapsedTime) * CHROMATIC_ABBERATION_OFFSET
    );
    effectsRef.current.offset.y = Math.max(
      0,
      Math.pow(0.5, state.clock.elapsedTime) * CHROMATIC_ABBERATION_OFFSET
    );
  });

  return (
    <>
      <color args={["#000000"]} attach="background" />
      <instancedMesh
        ref={meshRef as any}
        args={[undefined, undefined, COUNT]}
        matrixAutoUpdate
      >
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color={[1.5, 1.5, 1.5]} toneMapped={false} />
      </instancedMesh>
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} mipmapBlur />
        <ChromaticAberration
          ref={effectsRef as any}
          blendFunction={BlendFunction.NORMAL} // blend mode
          offset={
            new THREE.Vector2(
              CHROMATIC_ABBERATION_OFFSET,
              CHROMATIC_ABBERATION_OFFSET
            )
          }
        />
      </EffectComposer>
    </>
  );
};

function generatePos() {
  return (Math.random() - 0.5) * XY_BOUNDS;
}
