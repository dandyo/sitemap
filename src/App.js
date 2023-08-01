import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "@fancyapps/ui/dist/fancybox/fancybox.css"
import { AuthProvider } from './AuthContext';
import PrivateRoute from './PrivateRoute';

import Login from './Login';
import Home from './Home';
import Test from './Test';
import Generate from './Generate';

function App() {
  useEffect(() => {
    document.title = 'Sitemap Generator';
  }, []);

  // render() {
  return (
    <div className="App">
      <Router basename='sitemap'>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path='/home' element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path='/generate' element={<PrivateRoute><Generate /></PrivateRoute>} />
            <Route path='/test' element={<PrivateRoute><Test /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div >
  );
  // }
}

export default App;
