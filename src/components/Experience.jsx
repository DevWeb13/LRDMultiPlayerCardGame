import { Environment, OrbitControls } from '@react-three/drei';
import React from 'react';

import { Character } from './Character';

export const Experience = () => {
  return (
    <>
      <OrbitControls />
      <Character />
      <Environment
        preset='dawn'
        background
        blur={2}
      />
    </>
  );
};
