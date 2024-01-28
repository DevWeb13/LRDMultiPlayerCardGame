import { Canvas } from '@react-three/fiber';
import { Experience } from './components/Experience';
import React from 'react';
import { Leva } from 'leva';
import { isHost, isStreamScreen } from 'playroomkit';
import { UI } from './components/UI';
import { MotionConfig } from 'framer-motion';

const DEBUG = false;

function App() {
  return (
    <>
      <Leva hidden={!DEBUG || !isHost()} />
      <Canvas
        shadows
        camera={{
          position: isStreamScreen() ? [14, 10, -14] : [0, 4, 12],
          fov: 30,
        }}>
        <color
          attach='background'
          args={['#ececec']}
        />
        <MotionConfig
          transition={{
            type: 'spring',
            mass: 5,
            stiffness: 500,
            damping: 100,
            restDelta: 0.0001,
          }}></MotionConfig>
        <Experience />
      </Canvas>
      <UI />
    </>
  );
}

export default App;
