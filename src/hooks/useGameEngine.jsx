// src/hooks/useGameEngine.jsx

import { useControls } from 'leva';
import {
  getState,
  isHost,
  onPlayerJoin,
  useMultiplayerState,
  usePlayersList,
} from 'playroomkit';
import React, { useEffect, useRef } from 'react';
import { randInt } from 'three/src/math/MathUtils';

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

  const distributeCards = (nbCards) => {
    const newDeck = [...getState('deck')];
    players.forEach((player) => {
      const cards = player.getState('cards') || [];
      for (let i = 0; i < nbCards; i++) {
        const randomIndex = randInt(0, newDeck.length - 1);
        cards.push(newDeck[randomIndex]);
        newDeck.splice(randomIndex, 1);
      }
      player.setState('cards', cards, true);
      player.setState('selectedCard', 0, true);
      player.setState('playerTarget', -1, true);
    });
    setDeck(newDeck, true);
  };

  const startGame = () => {
    if (isHost()) {
      console.log('startGame');
      setTimer(TIME_PHASE_CARDS, true);
      const randomPlayer = randInt(0, players.length - 1); // random player start
      setPlayerStart(randomPlayer, true);
      setPlayerTurn(randomPlayer, true);
      setRound(1, true);
      setDeck(
        [
          ...new Array(16).fill(0).map(() => 'punch'),
          ...new Array(24).fill(0).map(() => 'grab'),
          ...new Array(8).fill(0).map(() => 'shield'),
        ],
        true
      );
      setGems(NB_GEMS, true);
      players.forEach((player) => {
        console.log('Setting up player', player.id);
        player.setState('cards', [], true);
        player.setState('gems', 0, true);
        player.setState('shield', false, true);
        player.setState('winner', false, true);
      });
      distributeCards(CARDS_PER_PLAYER);
      setPhase('cards', true);
    }
  };

  useEffect(() => {
    startGame();
    onPlayerJoin(startGame);
  }, []);

  const performPlayerAction = () => {
    const player = players[getState('playerTurn')];
    console.log('performPlayerAction', player.id);
    const selectedCard = player.getState('selectedCard');
    const cards = player.getState('cards');
    const card = cards[selectedCard];
    let success = true;
    if (card !== 'shield') {
      player.setState('shield', false, true);
    }
    switch (card) {
      case 'punch':
        let target = players[player.getState('playerTarget')];
        if (!target) {
          let targetIndex = (getState('playerTurn') + 1) % players.length; // next player
          player.setState('playerTarget', targetIndex, true);
          target = players[targetIndex]; // next player
        }
        console.log('Punch target', target.id);
        if (target.getState('shield')) {
          console.log('Target is shielded');
          success = false;
          break;
        }
        if (target.getState('gems') > 0) {
          target.setState('gems', target.getState('gems') - 1, true);
          setGems(getState('gems') + 1, true);
          console.log('Target has gems');
        }
        break;
      case 'grab':
        if (getState('gems') > 0) {
          player.setState('gems', player.getState('gems') + 1, true);
          setGems(getState('gems') - 1, true);
          console.log('Grabbeb gem');
        } else {
          console.log('No gems available');
          success = false;
        }
        break;
      case 'shield':
        console.log('Shield');
        player.setState('shield', true, true);
        break;
      default:
        break;
    }
    setActionsSuccess(success, true);
  };

  const removePlayerCard = () => {
    const player = players[getState('playerTurn')];
    const cards = player.getState('cards');
    const selectedCard = player.getState('selectedCard');
    cards.splice(selectedCard, 1);
    player.setState('cards', cards, true);
  };

  const getCard = () => {
    const player = players[getState('playerTurn')];
    if (!player) return '';
    const cards = player.getState('cards');
    if (!cards) return '';
    const selectedCard = player.getState('selectedCard');
    return cards[selectedCard];
  };

  const phaseEnd = () => {
    let newTime = 0;
    switch (getState('phase')) {
      case 'cards':
        if (getCard() === 'punch') {
          setPhase('playerChoice', true);
          newTime = TIME_PHASE_PLAYER_CHOICE;
        } else {
          performPlayerAction();
          setPhase('playerAction', true);
          newTime = TIME_PHASE_PLAYER_ACTION;
        }
        break;
      case 'playerChoice':
        performPlayerAction();
        setPhase('playerAction', true);
        newTime = TIME_PHASE_PLAYER_ACTION;
        break;
      case 'playerAction':
        removePlayerCard();
        const newPlayerTurn = (getState('playerTurn') + 1) % players.length;
        if (newPlayerTurn === getState('playerStart')) {
          // EVERY PLAYER PLAYED
          if (getState('round') === NB_ROUNDS) {
            // GAME END
            console.log('GAME END');
            let maxGems = 0;
            players.forEach((player) => {
              if (player.getState('gems') > maxGems) {
                maxGems = player.getState('gems');
              }
            });
            players.forEach((player) => {
              player.setState(
                'winner',
                player.getState('gems') === maxGems,
                true
              );
              player.setState('cards', [], true);
            });
            setPhase('end', true);
          } else {
            // NEXT ROUND
            console.log('NEXT ROUND');
            const newPlayerStart =
              (getState('playerStart') + 1) % players.length; // next player start
            setPlayerStart(newPlayerStart, true);
            setPlayerTurn(newPlayerStart, true);
            setRound(getState('round') + 1, true);
            distributeCards(1);
            setPhase('cards', true);
            newTime = TIME_PHASE_CARDS;
          }
        } else {
          // NEXT PLAYER
          console.log('NEXT PLAYER');
          setPlayerTurn(newPlayerTurn, true);
          if (getCard() === 'punch') {
            setPhase('playerChoice', true);
            newTime = TIME_PHASE_PLAYER_CHOICE;
          } else {
            performPlayerAction();
            setPhase('playerAction', true);
            newTime = TIME_PHASE_PLAYER_ACTION;
          }
        }
        break;
      default:
        break;
    }
    setTimer(newTime, true);
  };

  const { paused } = useControls({
    paused: false,
  });

  const timerInterval = useRef();

  const runTimer = () => {
    timerInterval.current = setInterval(() => {
      if (!isHost()) return;
      if (paused) return;
      let newTime = getState('timer') - 1;
      console.log('Timer', newTime);

      if (newTime <= 0) {
        phaseEnd();
      } else {
        setTimer(newTime, true);
      }
    }, 1000);
  };

  const clearTimer = () => {
    clearInterval(timerInterval.current);
  };

  useEffect(() => {
    runTimer();
    return clearTimer;
  }, [phase, paused]);

  return (
    <GameEngineContent.Provider
      value={{
        ...gameState,
        startGame,
        getCard,
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
