import React from 'react';
import { HashRouter } from 'react-router-dom';
import Routes from './router';
import Header from './Header/Header';

const App = () => {
  return (
    <HashRouter>
      <div>
        <Header/>
        <Routes />
      </div>
    </HashRouter>
  );
}

export default App;
