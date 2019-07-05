import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ReactGA, {EventArgs} from 'react-ga';

let trackableEventHandler;
if( process.env.REACT_APP_GA_ID ){
    ReactGA.initialize(process.env.REACT_APP_GA_ID);
    ReactGA.pageview(window.location.pathname + window.location.search);
    trackableEventHandler = ({ category, action, label }: EventArgs) => {
        ReactGA.event({ category, action, label })
    }
}

ReactDOM.render(<App
    onTrackableEvent={trackableEventHandler}
/>, document.getElementById('root'));