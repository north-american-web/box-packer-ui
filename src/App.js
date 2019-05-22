import React from 'react'
import './App.css'
import SolidInputManager from './components/SolidInputManager'
import {attemptPack} from './utils/boxPackerAPI'
import {Toast} from './components/Spectre'
import {PackingResults} from './components/PackingResults'
import {FaQuestionCircle} from "react-icons/fa";

class Instructions extends React.Component {
    state = {
        showInstructions: false
    }

    handleShowInstructions = (e) => {
        e.preventDefault()
        this.setState({
            showInstructions: true
        })
    }

    handleHideInstructions = (e) => {
        e.preventDefault()
        this.setState({
            showInstructions: false
        })
    }

    render() {
        return (
            <React.Fragment>
                {this.state.showInstructions ? (
                        <div className='container grid-lg'>
                            <div className={`modal ${this.state.showInstructions && 'active'}`}>
                                <a href="#close" className="modal-overlay" aria-label="Close"
                                   onClick={this.handleHideInstructions}/>
                                <div className="modal-container">
                                    <div className="modal-header">
                                        <a href="#close" className="btn btn-clear float-right"
                                           onClick={this.handleHideInstructions} aria-label="Close"/>
                                        <div className="modal-title h5">Help</div>
                                    </div>
                                    <div className="modal-body">
                                        <div className="content">
                                            <div className="instructions">
                                                <p>This is a simple tool for testing whether items will fit into a given
                                                    set of containers (boxes). Enter dimensions and (optionally) a
                                                    description for each of your items and boxes, and the tool will tell
                                                    you whether all the items fit into all the boxes.</p>
                                                <p>The &ldquo;<a href="https://en.wikipedia.org/wiki/Bin_packing_problem"
                                                                 target="_blank" rel='noopener noreferrer'>bin
                                                    packing problem</a>&rdquo; applies here. This tool doesn't
                                                    guarantee an optimal solution (i.e., for some combinations of items
                                                    and boxes, it will falsely claim the items don't fit), but it
                                                    is fast and good-enough for most purposes.</p>

                                                <h5>How to use</h5>
                                                <p>An item or box's specs should be entered in the following format: <code>width,
                                                    length,
                                                    height,
                                                    description</code>. Values must be comma-separated and descriptions are
                                                    optional.</p>
                                                <blockquote>
                                                    <p>
                                                        <em>Example 1:</em> <code>6,8,3</code><br/>
                                                        <em>Example 2:</em> <code>4.5, 4.2, 1, Random thing #1</code>
                                                    </p>
                                                </blockquote>
                                                <a className="btn btn-link"
                                                   onClick={this.handleHideInstructions}>Dismiss</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                    : (
                        <a className='instructions-toggle' onClick={this.handleShowInstructions}><FaQuestionCircle
                            size={22}/></a>
                    )}
            </React.Fragment>
        )
    }
}

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
