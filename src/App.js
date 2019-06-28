import React from 'react';
import PropTypes from 'prop-types';
import {attemptPack} from './utils/boxPackerAPI';
import './App.css';
import SolidInputManager from "./components/SolidInputManager";
import {Toast} from "./components/Spectre";
import PackingResultsView from "./components/PackingResultsView";

export function AppView({onBoxInputsChange, onItemInputsChange, apiRequest, apiResponse, error}) {
    return (
        <div className="App">
            <div className="container grid-lg">
                <div className='app-content'>
                    <div className='input-manager mt-2'>
                        <form>
                            <div className="columns">
                                <div className="column col-sm-12 col-6">
                                    <SolidInputManager
                                        title='Boxes'
                                        onChange={onBoxInputsChange}
                                        exampleItemName='Small box'
                                    />
                                </div>
                                <div className="column col-sm-12 col-6">
                                    <SolidInputManager
                                        title='Items'
                                        onChange={onItemInputsChange}
                                        exampleItemName='Coasters 2-pack'
                                    />
                                </div>
                            </div>
                        </form>
                    </div>

                    {error && (
                        <Toast status='error'>{error}</Toast>
                    )}

                    {apiResponse && (
                        <PackingResultsView
                            apiRequest={apiRequest}
                            apiResponse={apiResponse}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
AppView.propTypes = {
    onBoxInputsChange: PropTypes.func.isRequired,
    onItemInputsChange: PropTypes.func.isRequired,
    apiRequest: PropTypes.object,
    apiResponse: PropTypes.object,
    error: PropTypes.any
};

class App extends React.Component {
    static propTypes = {
        onTrackableEvent: PropTypes.func
    };

    state = {
        boxes: [],
        items: [],
        lastAPIRequest: undefined,
        lastAPIResponse: undefined,
        error: false,
        showInstructions: false
    };

    handleBoxesChange = (data) => this.handleChange('boxes', data);

    handleItemsChange = (data) => this.handleChange('items', data);

    handleChange = (inputType, data) => {
        this.setState({
            [inputType]: data
        }, () => {
            if (this.state.items.length > 0 && this.state.boxes.length > 0) {
                this.attemptPacking()
            }
        })
    };

    attemptPacking = () => {
        const request = {items: this.state.items, boxes: this.state.boxes};
        attemptPack(request)
            .then((data) => {
                this.setState({
                    lastAPIRequest: data.request,
                    lastAPIResponse: data.response,
                    error: false
                });

                this._onTrackableEvent({
                    category: 'Packing attempt',
                    action: 'Received API response'
                })
            })
            .catch((error) => {
                console.warn('Error fetching packing attempt results: ', error);

                this.setState({
                    lastAPIRequest: request,
                    error: `There was an error fetching packing attempt results.`
                });

                this._onTrackableEvent({
                    category: 'API Error',
                    action: 'API call failed'
                })
            })
    };

    _onTrackableEvent = (event) => {
        if (this.props.onTrackableEvent) {
            this.props.onTrackableEvent(event)
        }
    };

    render() {
        return (
            <AppView
                onBoxInputsChange={this.handleBoxesChange}
                onItemInputsChange={this.handleItemsChange}
                apiRequest={this.state.lastAPIRequest}
                apiResponse={this.state.lastAPIResponse}
                error={this.state.error}
            />
        );
    }
}

export default App;
