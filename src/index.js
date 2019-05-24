import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ReactGA from 'react-ga';

if( process.env.REACT_APP_GA_ID ){
    ReactGA.initialize(process.env.REACT_APP_GA_ID);
    ReactGA.pageview(window.location.pathname + window.location.search);
}

ReactDOM.render(<App
    onEvent={({ category, action, label }) => {
        if( process.env.REACT_APP_GA_ID ){
            ReactGA.event({ category, action, label })
        }
    }}
/>, document.getElementById('root'));