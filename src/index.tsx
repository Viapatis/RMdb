import React from 'react';
import ReactDOM from 'react-dom';
import store from './store/configureStore';
import { Provider } from 'react-redux';
import {
    BrowserRouter,
    Switch,
    Route,
    Link
  } from "react-router-dom";
ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
    , document.getElementById('root'))