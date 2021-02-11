import React, {Fragment} from 'react';
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import './App.css';
import { Container } from "semantic-ui-react";
import MenuBar from "./components/MenuBar";
import Home from "./pages/Home";
import Login from "./pages/Login"
import Register from "./pages/Register";
import Accounts from './pages/Accounts';
import Pay from './pages/Pay';
import NotFound from './pages/NotFound';

import { AuthProvider } from "./context/auth"
import AuthRoute from './utils/AuthRoute';
import FuncRoute from "./utils/FuncRoute";
import Footer from './components/Footer';

function App() {
  return (
    <Fragment>
      <AuthProvider>
      <Router>
        <Container>
          <MenuBar/>
          <Switch>
          <Route exact path="/" component={Home}/>
          <AuthRoute exact path="/login" component={Login}/>
          <AuthRoute exact path="/register" component={Register}/>
          <FuncRoute exact path="/accounts" component={Accounts}/>
          <FuncRoute exact path="/pay" component={Pay}/>
          <Route path="*" component={NotFound}/>
          </Switch>
      
        </Container>
        <Footer/>
    </Router>
      </AuthProvider>
  </Fragment>
    
  );
}

export default App;
