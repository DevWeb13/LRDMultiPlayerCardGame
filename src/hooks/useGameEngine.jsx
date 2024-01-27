// src/hooks/useGameEngine.jsx

import React from 'react';

const GameEngineContent = React.createContext({
  gameEngine: null,
  setGameEngine: () => {},
});

const TIME_PHASE_CARDS = 10;
const TIME_PHASE_PLAYER_CHOICE = 10;
const TIME_PHASE_PLAYER_ACTION = 3;
export const NB_ROUNDS = 3;
const CARDS_PER_PLAYER = 4;

export const GameEngineProvider = ({ children }) => {
  const [gameEngine, setGameEngine] = React.useState(null);

  return (
    <GameEngineContent.Provider
      value={{ gameEngine, setGameEngine: React.useState }}>
      {children}
    </GameEngineContent.Provider>
  );
};

export const useGameEngine = () => {
  const context = React.useContext(GameEngineContent);
  if (context === undefined) {
    throw new Error('useGameEngine must be used within a GameEngineProvider');
  }
  return context;
};
