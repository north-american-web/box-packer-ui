import React from 'react'
import './App.css'
import PropTypes from 'prop-types'
import SolidInputManager from './components/SolidInputManager'
import {attemptPack} from './utils/boxPackerAPI'
import {Toast} from './components/Spectre'
import PackingResultsView from './components/PackingResultsView'

function AppInterface({onBoxInputsChange, onItemInputsChange, apiRequest, apiResponse, error}) {
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
                            apiRequest={JSON.stringify(apiRequest, null, 2)}
                            apiResponse={JSON.stringify(apiResponse, null, 2)}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

class App extends React.Component {
    state = {
        boxes: [],
        items: [],
        lastAPIRequest: undefined,
        lastAPIResponse: undefined,
        error: false,
        showInstructions: false
    }

    handleChange = (inputType, data) => {
        this.setState({
            [inputType]: data
        }, () => {
            if (this.state.items.length > 0) {
                this.attemptPacking()
            }
        })
    }

    getSolidsVolume = (solidType) => {
        if (!this.state[solidType]) {
            return 0
        }

        return this.state[solidType].reduce((total, solid) => total + (solid.width * solid.length * solid.height), 0)
    }

    attemptPacking = () => {
        const request = {items: this.state.items, boxes: this.state.boxes}
        attemptPack(request)
            .then((data) => {
                this.setState({
                    lastAPIRequest: data.request,
                    lastAPIResponse: data.response,
                    error: false
                })

                this._onEvent({
                    category: 'Packing attempt',
                    action: 'Received API response'
                })
            })
            .catch((error) => {
                console.warn('Error fetching packing attempt results: ', error)

                this.setState({
                    lastAPIRequest: request,
                    error: `There was an error fetching packing attempt results.`
                })

                this._onEvent({
                    category: 'API Error',
                    action: 'API call failed'
                })
            })
    }

    _onEvent = (event) => {
        if (this.props.onEvent) {
            this.props.onEvent(event)
        }
    }

    render() {
        const itemVolume = this.getSolidsVolume('items')
        const boxVolume = this.getSolidsVolume('boxes')

        return (
            <AppInterface
                onBoxInputsChange={(data) => this.handleChange('boxes', data)}
                onItemInputsChange={(data) => this.handleChange('items', data)}
                itemVolume={itemVolume}
                boxVolume={boxVolume}
                apiRequest={this.state.lastAPIRequest}
                apiResponse={this.state.lastAPIResponse}
                error={this.state.error}
            />
        );
    }
}

App.propTypes = {
    onEvent: PropTypes.func
}

export default App;
