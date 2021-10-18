import React from 'react';
import ReactDOM from 'react-dom';
import store from './store/configureStore';
import { Provider } from 'react-redux';
import Main from './components/Main';
import {
    BrowserRouter} from "react-router-dom";
ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Main></Main>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
    , document.getElementById('root'))