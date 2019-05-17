import React from 'react'
import PropTypes from 'prop-types';
import {SolidInput} from "./Solid";

export class SolidInputManager extends React.Component {
    state = {
        inputsData: new Map()
    }

    // Used to ensure item ids are always unique
    childIterator = 1

    componentDidMount() {
        this.addInput()
    }

    addInput = () => {
        const id = `bi_${Date.now()}_${this.childIterator++}`;
        this.setState(({inputsData}) => {
            inputsData.set(id, {})
            return {inputsData}
        })
    }

    handleInputNext = () => {
        if (this.state.inputsData.size === this.getValidSolids().length) {
            this.addInput()
        }
    }

    handleInputRemove = (key) => {
        let {inputsData} = this.state
        inputsData.size > 1 ? inputsData.delete(key) : inputsData.set(key, {});
        this.setState({inputsData}, () => {
            this._onChange()
        })
    }

    handleInputSubmit = (key, data) => {
        const {inputsData} = this.state
        inputsData.set(key, data)
        this.setState({inputsData}, () => {
            this._onChange()
        })
    }

    _onChange = () => {
        this.props.onChange(this.getValidSolids())
    }

    getValidSolids = () => {
        return Array.from(this.state.inputsData.values()).filter((solid) => this.isDataValid(solid))
    }

    isDataValid = ({width, length, height}) => {
        return (width > 0 && length > 0 && height > 0)
    }

    render() {
        const solidInputs = []
        let inputsCount = 0

        this.state.inputsData.forEach((value, key) => {
            solidInputs.push(<SolidInput
                key={key}
                inputKey={key}
                onSubmit={this.handleInputSubmit}
                onNext={this.handleInputNext}
                onRemove={
                    inputsCount++ > 0
                        ? () => {
                            this.handleInputRemove(key)
                        }
                        : undefined
                }
                isDataValid={this.isDataValid}
            />)
        })

        return (
            <div className="panel">
                <div className="panel-header">
                    <div className="panel-title">{this.props.title}</div>
                </div>
                <div className="panel-body">
                    {this.props.children}

                    {solidInputs}
                </div>
                <div className="panel-footer">
                    {this.state.inputsData.size === this.getValidSolids().length && (
                        <button className='btn btn-primary btn-sm' onClick={this.addInput}>+</button>
                    )}
                </div>
            </div>

        )
    }
}

SolidInputManager.propTypes = {
    title: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
}

export default SolidInputManager;