import React from "react";
import {FaQuestionCircle} from "react-icons/fa";

export default class Instructions extends React.Component {
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
                                <button type='button' className="modal-overlay" aria-label="Close"
                                   onClick={this.handleHideInstructions}/>
                                <div className="modal-container">
                                    <div className="modal-header">
                                        <button type='button' className="btn btn-clear float-right"
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
                                                <button type='button' className="btn btn-link"
                                                   onClick={this.handleHideInstructions}>Dismiss</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                    : (
                        <a className='instructions-toggle' href='#open-instructions' onClick={this.handleShowInstructions}><FaQuestionCircle
                            size={22}/></a>
                    )}
            </React.Fragment>
        )
    }
}