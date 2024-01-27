import { Environment, OrbitControls } from '@react-three/drei';
import React from 'react';
import { Card } from './Card';

export const Experience = () => {
  return (
    <>
      <OrbitControls />
      <Card />
      <Card
        position-x={-2}
        type='punch'
      />
      <Card
        position-x={2}
        type='grab'
      />
      <Environment
        preset='dawn'
        background
        blur={2}
      />
    </>
  );
};
