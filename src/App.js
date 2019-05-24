import React from 'react'
import './App.css'
import PropTypes from 'prop-types'
import SolidInputManager from './components/SolidInputManager'
import {attemptPack} from './utils/boxPackerAPI'
import {Toast} from './components/Spectre'
import {PackingResults} from './components/PackingResults'
import Instructions from './components/Instructions'

function AppInterface({onBoxInputsChange, onItemInputsChange, apiResults, error, showInstructions, handleShowInstructions, handleHideInstructions}) {
    return (
        <div className="App">
            <Instructions/>
            <div className="container grid-lg">
                <div className='app-content'>
                    <div className='input-manager mt-2'>
                        <div className="columns">
                            <div className="column col-sm-12 col-6">
                                <SolidInputManager
                                    title='Boxes'
                                    onChange={onBoxInputsChange}
                                />
                            </div>
                            <div className="column col-sm-12 col-6">
                                <SolidInputManager
                                    title='Items'
                                    onChange={onItemInputsChange}
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <Toast status='error'>{error}</Toast>
                    )}

                    {apiResults && (
                        <PackingResults
                            success={apiResults.success}
                            packed={apiResults.packed}
                            empty={apiResults.empty}
                            leftOverItems={apiResults.leftOverItems}/>
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
        apiResults: null,
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
        attemptPack(this.state)
            .then((data) => {
                this.setState({
                    apiResults: data,
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
                    error: `There was an error fetching packing attempt results.`
                })

                this._onEvent({
                    category: 'API Error',
                    action: 'API call failed'
                })
            })
    }

    _onEvent = (event) => {
        if( this.props.onEvent ){
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
                apiResults={this.state.apiResults}
                error={this.state.error}
            />
        );
    }
}

App.propTypes = {
    onEvent: PropTypes.func
}

export default App;
