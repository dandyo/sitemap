import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "@fancyapps/ui/dist/fancybox/fancybox.css"
import { UserContext } from './AuthContext';
// import PrivateRoute from './PrivateRoute';

import Login from './Login';
import Home from './Home';
import Test from './Test';
import Generate from './Generate';

function App() {
  useEffect(() => {
    document.title = 'Sitemap Generator';
  }, []);

  const { user } = useContext(UserContext);

  // render() {
  return (
    <div className="App">
      <Router basename='sitemap'>
        <Routes>
          {user &&
            <>
              <Route path="/" element={<Home />} />
              <Route path="/generate" element={<Generate />} />
              <Route path="/test" element={<Test />} />
            </>
          }
          {!user &&
            <>
              <Route path="/login" element={<Login />} />
            </>
          }
          <Route path="*" element={<Navigate to={user ? '/' : '/login'} />} />
        </Routes>
      </Router>
    </div >
  );
  // }
}

export default App;
