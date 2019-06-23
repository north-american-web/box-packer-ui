import React from 'react'
import PropTypes from 'prop-types';
import SolidInput from "./SolidInput";
import {Panel} from './Spectre'

function SolidInputManagerInterface({title, inputs, showAddBtn, addClickHandler, exampleItemName}) {
    return (
        <Panel
            title={title}
            footer={showAddBtn && (
                <button className='btn btn-primary btn-sm' aria-label='Add an item' onClick={addClickHandler}>+</button>
            )}
        >
            <p className="input-help">Enter width, length, height, (optional) description. Omit units.<br/>
                <em>Example:</em> <code>4.5, 4.2, 1{exampleItemName && ', ' + exampleItemName }</code>
            </p>

            {inputs}
        </Panel>
    )
}
SolidInputManagerInterface.propTypes = {
    title: PropTypes.string.isRequired,
    inputs: PropTypes.array.isRequired,
    showAddBtn: PropTypes.bool.isRequired,
    addClickHandler: PropTypes.func.isRequired,
    exampleItemName: PropTypes.string
}

export class SolidInputManager extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        exampleItemName: PropTypes.string
    }

    constructor(props){
        super(props)

        this.state = {
            solids: new Map([this.generateNewInputSpecs()])
        }
    }

    // Used to ensure item ids are always unique
    childIterator = 1

    generateNewInputSpecs = () => {
        const id = `bi_${Date.now()}_${this.childIterator++}`;
        return [id, {}]
    }

    addInput = () => {
        const [id, data] = this.generateNewInputSpecs()
        this.setState(({solids}) => {
            solids.set(id, data)
            return {solids}
        })
    }

    handleInputNext = () => {
        if (this.state.solids.size === this.getValidSolids().length) {
            this.addInput()
        }
    }

    handleInputRemove = (key) => {
        let {solids} = this.state
        solids.size > 1 ? solids.delete(key) : solids.set(key, {});
        this.setState({solids}, () => {
            this._onChange()
        })
    }

    handleInputSubmit = (key, data) => {
        const {solids} = this.state
        solids.set(key, data)
        this.setState({solids}, () => {
            this._onChange()
        })
    }

    _onChange = () => {
        this.props.onChange(this.getValidSolids())
    }

    /**
     *
     * @returns {V[]}
     */
    getValidSolids = () => {
        return Array.from(this.state.solids.values()).filter(solid => this.isDataValid(solid))
    }

    isDataValid = ({width, length, height}) => {
        const MAX = 999999999 // This is arbitrary

        return (width > 0 && width < MAX
            && length > 0 && length < MAX
            && height > 0 && height < MAX )
    }

    render() {
        const solidInputs = []

        this.state.solids.forEach((value, key) => {
            solidInputs.push(<SolidInput
                key={key}
                inputKey={key}
                onSubmit={this.handleInputSubmit}
                onNext={this.handleInputNext}
                onRemove={() => {
                    this.handleInputRemove(key)
                }}
                isDataValid={this.isDataValid}
            />)
        })

        return (
            <SolidInputManagerInterface
                title={this.props.title}
                inputs={solidInputs}
                showAddBtn={this.state.solids.size === this.getValidSolids().length}
                addClickHandler={() => {
                    this.addInput()
                }}
                exampleItemName={this.props.exampleItemName}
            />
        )
    }
}

export default SolidInputManager;