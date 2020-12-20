import React from 'react';
import ReactDOM from 'react-dom';
import { NewApp } from './App';
import reportWebVitals from './reportWebVitals';

import 'fontsource-roboto/300-normal.css';
import 'fontsource-roboto/400-normal.css';
import 'fontsource-roboto/500-normal.css';
import 'fontsource-roboto/700-normal.css';

import { CssBaseline } from '@material-ui/core';

ReactDOM.render(
    <React.StrictMode>
        <CssBaseline />
        <NewApp />
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
