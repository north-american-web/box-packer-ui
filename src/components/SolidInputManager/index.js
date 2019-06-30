import React from 'react'
import PropTypes from 'prop-types';
import SolidInput from "../SolidInput";
import {Panel} from '../Spectre'

export function SolidInputManagerView({title, inputs, allowAdd, addClickHandler, exampleItemName}) {
    return (
        <Panel
            title={title}
            footer={(
                <button className='btn btn-primary btn-sm'
                        aria-label='Add solid'
                        disabled={!allowAdd}
                        onClick={addClickHandler}>+</button>
            )}
        >
            <p className="input-help">Enter width, length, height, (optional) description. Omit units.<br/>
                <em>Example:</em> <code>4.5, 4.2, 1, {exampleItemName && (
                    <span data-testid='example-item-name'>{exampleItemName}</span>
                ) }</code>
            </p>
            {inputs}
        </Panel>
    )
}
SolidInputManagerView.propTypes = {
    title: PropTypes.string.isRequired,
    inputs: PropTypes.array.isRequired,
    allowAdd: PropTypes.bool.isRequired,
    addClickHandler: PropTypes.func.isRequired,
    exampleItemName: PropTypes.string
};

export class SolidInputManager extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        exampleItemName: PropTypes.string
    };

    constructor(props){
        super(props);

        this.state = {
            solids: new Map([this.generateNewInputSpecs()])
        }
    }

    // Used to ensure item ids are always unique
    childIterator = 1;

    generateNewInputSpecs = () => {
        const id = `bi_${Date.now()}_${this.childIterator++}`;
        return [id, {}]
    };

    addInput = () => {
        const [id, data] = this.generateNewInputSpecs();
        this.setState(({solids}) => {
            solids.set(id, data);
            return {solids}
        })
    };

    handleInputNext = () => {
        if (this.state.solids.size === this.getValidSolids().length) {
            this.addInput()
        }
    };

    handleInputDuplicate = (key, data) => {
        const [newKey] = this.generateNewInputSpecs();
        this.setState(({solids}) => {
            solids.set(key, data);
            solids.set(newKey, Object.assign({}, data));
            return {solids};
        });
    };

    handleInputRemove = (key) => {
        let {solids} = this.state;
        solids.size > 1 ? solids.delete(key) : solids.set(key, {});
        this.setState({solids}, () => {
            this._onChange()
        })
    };

    handleInputSubmit = (key, data) => {
        const {solids} = this.state;
        solids.set(key, data);
        this.setState({solids}, () => {
            this._onChange()
        })
    };

    _onChange = () => {
        this.props.onChange(this.getValidSolids())
    };

    /**
     *
     * @returns {V[]}
     */
    getValidSolids = () => {
        return Array.from(this.state.solids.values()).filter(solid => this.isDataValid(solid))
    };

    isDataValid = ({width, length, height}) => {
        const MAX = 999999999; // This is arbitrary

        return (width > 0 && width < MAX
            && length > 0 && length < MAX
            && height > 0 && height < MAX )
    };

    render() {
        const solidInputs = [];

        this.state.solids.forEach((value, key) => {
            let solidProps = {
                key: key,
                inputKey: key,
                isDataValid: this.isDataValid,
                removeMayBeDisabled: key === this.state.solids.keys().next().value && this.state.solids.size === 1,
                onDuplicate: this.handleInputDuplicate,
                onNext: this.handleInputNext,
                onRemove: () => this.handleInputRemove(key),
                onSubmit: this.handleInputSubmit,
            };
            if( value.width || value.length || value.height || value.description ){
                const parts = Object.values(value).filter((entry, key) => !!entry || entry === 0);
                solidProps.inputValue = parts.join(',');
            }

            solidInputs.push(<SolidInput {...solidProps} />)
        });

        const showAddButton = this.state.solids.size === this.getValidSolids().length;

        return (
            <SolidInputManagerView
                title={this.props.title}
                inputs={solidInputs}
                allowAdd={showAddButton}
                addClickHandler={this.addInput}
                exampleItemName={this.props.exampleItemName}
            />
        )
    }
}

export default SolidInputManager;