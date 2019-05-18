import React from 'react'
import './App.css'
import SolidInputManager from './components/SolidInputManager'
import {attemptPack} from './utils/boxPackerAPI'
import {Panel, Toast} from './components/Spectre'
import {FillProgress, PackingResults } from './components/PackingResults'

function AppInterface({ onBoxInputsChange, onItemInputsChange, boxVolume, itemVolume, apiResults, error }){
    return (
        <div className="App container grid-lg">
            {boxVolume > 0 && (
                <Panel
                    title='Container fill progress by volume'
                    footer={ <small className="text-gray">Remember, this is just volume!</small>}
                >
                    <FillProgress
                        percent={itemVolume === 0 ? 0 : (itemVolume / boxVolume) * 100}
                    />
                </Panel>
            )}

            <div className='input-manager mt-2'>
                <div className="columns">
                    <div className="column col-md-6">
                        <SolidInputManager
                            title='Boxes'
                            onChange={onBoxInputsChange}
                        />
                    </div>
                    <div className="column col-md-12">
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
    )
}

class App extends React.Component {
    state = {
        boxes: [],
        items: [],
        apiResults: null,
        error: false
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
        if (this.getSolidsVolume('items') > this.getSolidsVolume('boxes')) {
            this.setState({
                apiResults: null
            })
            return (
                <p className="alert alert-danger">Items volume exceeds volume of boxes. API not called, because the
                    items
                    can't possibly fit.</p>
            )
        }

        attemptPack(this.state)
            .then((data) => {
                this.setState({
                    apiResults: data
                })
            })
            .catch((error) => {
                console.warn('Error fetching packing attempt results: ', error)

                this.setState({
                    error: `There was an error fetching packing attempt results.`
                })
            })
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

export default App;
