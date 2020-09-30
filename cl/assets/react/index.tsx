// index.tsx
// Entrypoint for React
import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes';
import AuthContextProvider from './withUser';

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <Routes />
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('react-root')
);
