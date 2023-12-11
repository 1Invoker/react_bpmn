import React from 'react';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './Redux/store';
import Routes from './router';
import Header from './Header/Header';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HashRouter>
          <div>
            <Header />
            <Routes />
          </div>
        </HashRouter>
      </PersistGate>
    </Provider>
  );
};

export default App;