// src/hooks/useGameEngine.jsx

import { useMultiplayerState, usePlayersList } from 'playroomkit';
import React from 'react';

const GameEngineContent = React.createContext({});

const TIME_PHASE_CARDS = 10;
const TIME_PHASE_PLAYER_CHOICE = 10;
const TIME_PHASE_PLAYER_ACTION = 3;
export const NB_ROUNDS = 3;
const NB_GEMS = 3;
const CARDS_PER_PLAYER = 4;

export const GameEngineProvider = ({ children }) => {
  // GAME STATE
  const [timer, setTimer] = useMultiplayerState('timer', 0);
  const [round, setRound] = useMultiplayerState('round', 1);
  const [phase, setPhase] = useMultiplayerState('phase', 'lobby');
  const [playerTurn, setPlayerTurn] = useMultiplayerState('playerTurn', 0);
  const [playerStart, setPlayerStart] = useMultiplayerState('playerStart', 0);
  const [deck, setDeck] = useMultiplayerState('deck', []);
  const [gems, setGems] = useMultiplayerState('gems', NB_GEMS);
  const [actionsSuccess, setActionsSuccess] = useMultiplayerState(
    'actionsSuccess',
    true
  );

  const players = usePlayersList(true);
  players.sort((a, b) => a.id.localeCompare(b.id)); // sort players by id

  const gameState = {
    timer,
    round,
    phase,
    playerTurn,
    playerStart,
    players,
    gems,
    deck,
    actionsSuccess,
  };

  return (
    <GameEngineContent.Provider
      value={{
        ...gameState,
      }}>
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
