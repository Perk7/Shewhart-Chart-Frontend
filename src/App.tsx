import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './scrollToTop';

import Main from './components/Main';
import NotFound from './components/NotFound'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;