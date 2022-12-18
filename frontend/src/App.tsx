import React from 'react';
// import logo from './logo.svg';
import { Routes, Route } from 'react-router-dom';

import routes from 'features/routing';

import './App.css';

function App() {
  return (
    <div className="App">
      {/* TODO odkomentować jak komponenty odpowiednie będą zrobione */}
      <Routes>
        {routes.map(({ path, exact, component: Component }) => (
          <Route path={path} element={<Component />} key={path}></Route>
        ))}
      </Routes>
    </div>
  );
}

export default App;
