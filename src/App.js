import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import UserForm from './components/UserForm';
import GameApp from './GameApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

export default function App() {
    const [user, loading, error] = useAuthState(auth);
    if (loading) {
        return 'Loading... ... ...'
    }
    if (error) {
        return 'There is erorr'
    }
    if (!user) {
        return <UserForm />
    }
    return (
        <Router>
            <Switch>
                <Route exact path='/'>
                    <Home />
                </Route>
                <Route exact path='/game/:id'>
                    <GameApp />
                </Route>
            </Switch>
        </Router>
    )
}