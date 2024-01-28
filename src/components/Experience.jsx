import { Environment, OrbitControls } from '@react-three/drei';
import React from 'react';

import { Character } from './Character';
import { MobileController } from './MobileController';

export const Experience = () => {
  return (
    <>
      <OrbitControls />
      <MobileController />
      <Environment
        preset='dawn'
        background
        blur={2}
      />
    </>
  );
};
