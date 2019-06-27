import React from 'react'
import './App.css'
import PropTypes from 'prop-types'
import SolidInputManager, {SolidInputManagerView} from './components/SolidInputManager'
import {attemptPack} from './utils/boxPackerAPI'
import {Toast} from './components/Spectre'
import PackingResultsView from './components/PackingResultsView'

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
                            success={apiResponse.success}
                            packed={apiResponse.packed}
                            empty={apiResponse.empty}
                            leftOverItems={apiResponse.leftOverItems}
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

    handleChange = (inputType, data) => {
        this.setState({
            [inputType]: data
        }, () => {
            if (this.state.items.length > 0) {
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
                onBoxInputsChange={(data) => this.handleChange('boxes', data)}
                onItemInputsChange={(data) => this.handleChange('items', data)}
                apiRequest={this.state.lastAPIRequest}
                apiResponse={this.state.lastAPIResponse}
                error={this.state.error}
            />
        );
    }
}

export default App;
