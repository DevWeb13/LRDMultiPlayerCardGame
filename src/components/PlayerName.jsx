import { Billboard, Text } from '@react-three/drei';
import React from 'react';

export const PlayerName = ({ name = '', fontSize = 0.2, ...props }) => (
  <Billboard {...props}>
    <Text
      anchorY={'bottom'}
      fontSize={fontSize}
      font='/fonts/RobotoSlab-Bold.ttf'>
      {name}
    </Text>
  </Billboard>
);
