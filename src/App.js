import React from 'react';
import './App.css';
import SolidInputManager from './components/SolidInputManager'
import {SolidPreview} from "./components/Solid"
import {attemptPack} from './utils/boxPackerAPI'

function PackingResults({success, packed = [], empty = [], leftOverItems = []}) {
    return (
        <div className="panel mt-2">
            <div className="panel-header">
                <div className="panel-title">Results</div>
            </div>

            <div className="panel-body">
                <div className={`toast toast-${success ? 'success' : 'error'}`}>
                    The item(s) {success ? '' : 'won\'t'} fit into the box(es)!
                </div>

                <div className="columns mt-2">
                    <div className="column col-md-4">
                        <h6>Packed boxes</h6>
                        <ul>
                            {packed.map((box) => (
                                <li>
                                    <SolidPreview fallbackDescription='Box' solid={box}>
                                        {box.contents.map((item) => (
                                            <SolidPreview fallbackDescription='Item' solid={item}/>
                                        ))}
                                    </SolidPreview>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="column col-md-4">
                        <h6>Empty boxes</h6>
                        <ul>
                            {empty.map((item) => (
                                <li><SolidPreview fallbackDescription='Box' solid={item}/></li>
                            ))}
                        </ul>
                    </div>

                    <div className="column col-md-4">
                        <h6>Left-over items</h6>
                        <ul>
                            {leftOverItems.map((item) => (
                                <li><SolidPreview fallbackDescription='Item' solid={item}/></li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

function FillProgress({percent}) {
    const classNameExtra = percent > 100
        ? 'bg-error'
        : percent > 90 ? 'bg-warning' : ''
    return (
        <>
            <div className="bar bar-sm">
                <div
                    className={`bar-item ${classNameExtra}`}
                    role="progressbar"
                    style={{width: `${percent}%`}}
                    aria-valuenow={percent} aria-valuemin="0"
                    aria-valuemax="100"
                ></div>
            </div>
            { percent > 100 && (
                <div className="toast toast-error">
                    The volume of the items exceeds the volume of the container(s). The packing algorithm will not be run.
                </div>
            )}
        </>
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
            <div className="App container grid-lg">

                {this.getSolidsVolume('boxes') > 0 && (
                    <div className="panel mt-2">
                        <div className="panel-header">Container fill progress by volume</div>
                        <div className="panel-body">
                            <FillProgress
                                percent={itemVolume === 0 ? 0 : (itemVolume / boxVolume) * 100}
                            />
                        </div>
                        <div className="panel-footer">
                            <small className="text-gray">Remember, this is just volume!</small>
                        </div>
                    </div>
                )}

                <div className='input-manager mt-2'>
                    <div className="columns">
                        <div className="column col-md-6">
                            <SolidInputManager
                                title='Boxes'
                                onChange={(data) => this.handleChange('boxes', data)}
                                solids={this.state.boxes}
                            />
                        </div>
                        {boxVolume > 0 && (
                            <div className="column col-md-12">
                                <SolidInputManager
                                    title='Items'
                                    onChange={(data) => this.handleChange('items', data)}
                                    solids={this.state.items}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {this.state.error && (
                    <div className="toast toast-error">{this.state.error}</div>
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
