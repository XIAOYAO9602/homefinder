import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Navigation from "./components/Navigation.js";
import LoginPage from "./pages/LoginPage.js";
import SignUpPage from "./pages/SignUpPage.js";
import Home from './pages/Home';
import ApartmentView from './pages/ApartmentView';
import Favorites from './pages/Favorites';
import 'semantic-ui-css/semantic.min.css'

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getUser = async () => {
      const res = await fetch('/api/user');
      const user = await res.json();
      if (user === 'no user found') {
        setUser(null);
      } else {
        setUser(user)
      }
    }
    getUser();
  }, [])

  return (
    <Router>
      <div className="App">
        <Navigation user={user} setUser={setUser}/>
        <Switch>
          <Route exact path="/login">
            <LoginPage setUser={setUser}/>
          </Route>
          <Route exact path="/signup">
            <SignUpPage setUser={setUser}/>
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/apt/:aptId">
            <ApartmentView user={user} setUser={setUser}/>
          </Route>
          <Route exact path="/favorites">
            <Favorites user={user} setUser={setUser}/>
          </Route>
         
        </Switch>
      </div>
    </Router>
  );
}

export default App;
