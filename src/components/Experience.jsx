import { Environment, OrbitControls } from '@react-three/drei';
import React from 'react';

import { MobileController } from './MobileController';
import { isStreamScreen } from 'playroomkit';
import { Gameboard } from './Gameboard';

export const Experience = () => {
  return (
    <>
      <OrbitControls />
      {isStreamScreen() ? <Gameboard /> : <MobileController />}
      <Environment
        preset='dawn'
        background
        blur={2}
      />
    </>
  );
};
