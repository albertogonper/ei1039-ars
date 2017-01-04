import * as React from 'react';
import {Route, IndexRoute} from 'react-router';

import {App} from '../views/app';
import {MainView} from '../views/main-view';
import {Login} from '../views/login';
import {Signup} from '../views/signup';
import {Dashboard} from "../views/dashboard";
import {Display} from "../views/display";
import {Keypad} from "../views/keypad";
import {
    checkIfLoggedIn,
    checkIfNotLoggedIn,
    checkIfNotLoggedInForDisplay, checkIfNotLoggedInForKeypad
} from "./routes-callbacks";

export default (
    <Route path="/" component={App} >
        <IndexRoute component={MainView} onEnter={checkIfLoggedIn}/>
        <Route path="login" component={Login} onEnter={checkIfLoggedIn}/>
        <Route path="signup" component={Signup} onEnter={checkIfLoggedIn}/>
        <Route path="dashboard" component={Dashboard} onEnter={checkIfNotLoggedIn}/>
        <Route path="display/:courseId" component={Display} onEnter={checkIfNotLoggedInForDisplay}/>
        <Route path="keypad/:courseId" component={Keypad} onEnter={checkIfNotLoggedInForKeypad}/>
    </Route>
);