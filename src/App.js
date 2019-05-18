import React from 'react'
import './App.css'
import SolidInputManager from './components/SolidInputManager'
import {attemptPack} from './utils/boxPackerAPI'
import {Panel, Toast} from './components/Spectre'
import {FillProgress, PackingResults } from './components/PackingResults'

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
            <div className="App container grid-lg">
                {this.getSolidsVolume('boxes') > 0 && (
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
                                onChange={(data) => this.handleChange('boxes', data)}
                            />
                        </div>
                        <div className="column col-md-12">
                            <SolidInputManager
                                title='Items'
                                onChange={(data) => this.handleChange('items', data)}
                            />
                        </div>
                    </div>
                </div>

                {this.state.error && (
                    <Toast status='error'>{this.state.error}</Toast>
                )}

                {this.state.apiResults && (
                    <PackingResults
                        success={this.state.apiResults.success}
                        packed={this.state.apiResults.packed}
                        empty={this.state.apiResults.empty}
                        leftOverItems={this.state.apiResults.leftOverItems}/>
                )}

            </div>
        );
    }
}

export default App;
