import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GameEngineProvider } from './hooks/useGameEngine';
import { insertCoin } from 'playroomkit';

const rootElement = document.getElementById('root');
if (rootElement) {
  insertCoin({
    streamMode: true,
  }).then(() => {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <GameEngineProvider>
          <App />
        </GameEngineProvider>
      </React.StrictMode>
    );
  });
}
