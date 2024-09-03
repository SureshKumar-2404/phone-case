import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

const Customization = lazy(() => import('./components/Customization/Customization'));
const PhoneSelector = lazy(() => import('./components/PhoneSelector/PhoneSelector'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={<App />}>
            <Route index element={<PhoneSelector />} />
            <Route path='phone' element={<PhoneSelector />} />
            <Route path='custom/:id' element={<Customization />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  </React.StrictMode>
);
