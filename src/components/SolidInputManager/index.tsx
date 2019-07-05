import React from 'react'
import PropTypes from 'prop-types';
import SolidInput, {SolidInputProps} from "../SolidInput";
import {Panel} from '../Spectre'
import {isSolidEmpty, makeEmptySolid, SolidInterface} from "../Solid";

interface SolidInputManagerViewProps {
    title: string,
    inputs: JSX.Element[],
    allowAdd: boolean,
    addClickHandler: (event: React.MouseEvent<HTMLButtonElement>) => void,
    exampleItemName: string
}

export function SolidInputManagerView({
                                          title,
                                          inputs,
                                          allowAdd,
                                          addClickHandler,
                                          exampleItemName
                                      }: SolidInputManagerViewProps) {
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
            {inputs}
            <p className="input-help">Enter width, length, height, (optional) description. Omit units.<br/>
                <em>Example:</em> <code>4.5, 4.2, 1, {exampleItemName && (
                    <span data-testid='example-item-name'>{exampleItemName}</span>
                )}</code>
            </p>
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

interface SolidInputManagerProps {
    title: string;
    onChange(solids: SolidInterface[]): void;
    exampleItemName: string;
}

export class SolidInputManager extends React.Component<SolidInputManagerProps, any> {
    static propTypes = {
        title: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        exampleItemName: PropTypes.string
    };

    constructor(props: SolidInputManagerProps) {
        super(props);

        this.state = {
            solids: new Map([this.generateNewInputSpecs()])
        }
    }

    // Used to ensure item ids are always unique
    childIterator = 1;

    generateNewInputSpecs = (): [string, {}] => {
        const id = `bi_${Date.now()}_${this.childIterator++}`;
        return [id, makeEmptySolid()]
    };

    addInput = () => {
        const [id, data] = this.generateNewInputSpecs();
        this.setState(({solids}: { solids: Map<string, SolidInterface | {}> }) => {
            solids.set(id, data);
            return {solids}
        })
    };

    handleInputNext = () => {
        if (this.state.solids.size === this.getValidSolids().length) {
            this.addInput()
        }
    };

    /**
     * @param key
     * @param data
     */
    handleInputDuplicate = (key: string, data: SolidInterface) => {
        const existingKey = this.getLastKeyForDuplicateData(key);
        const [newKey,] = this.generateNewInputSpecs();

        this.setState(({solids}: { solids: Map<string, SolidInterface> }) => {
            if (existingKey) {
                solids.delete(existingKey);
            }
            solids.set(key, data);
            solids.set(newKey, Object.assign({}, data));
            return {solids};
        }, () => {
            this._onChange();
        });
    };

    getLastKeyForDuplicateData = (excludeKey: string): string | null => {
        for (const [index, value] of this.state.solids.entries()) {
            if (index !== excludeKey && isSolidEmpty(value)) {
                return index;
            }
        }
        return null;
    };

    handleInputRemove = (key: string) => {
        let {solids} = this.state;
        solids.size > 1 ? solids.delete(key) : solids.set(key, {});
        this.setState({solids}, () => {
            this._onChange()
        })
    };

    handleInputSubmit = (key: string, data: SolidInterface) => {
        const {solids} = this.state;
        solids.set(key, data);
        this.setState({solids}, () => {
            this._onChange()
        })
    };

    _onChange = () => {
        this.props.onChange(this.getValidSolids())
    };

    getValidSolids = () => {
        const validityTest = (solid: SolidInterface) => this.isDataValid(solid);
        const solids: SolidInterface[] = this.state.solids.values();
        return Array.from(solids).filter(validityTest);
    };

    isDataValid = ({width, length, height}: SolidInterface) => {
        const MAX = 999999999; // This is arbitrary

        return (width !== null && width > 0 && width < MAX
            && length !== null && length > 0 && length < MAX
            && height !== null && height > 0 && height < MAX)
    };

    render() {
        const solidInputs: JSX.Element[] = [];

        this.state.solids.forEach((value: SolidInterface, key: string) => {
            const solidProps: SolidInputProps = {
                key: key,
                inputKey: key,
                isDataValid: this.isDataValid,
                removeMayBeDisabled: key === this.state.solids.keys().next().value && this.state.solids.size === 1,
                onDuplicate: this.handleInputDuplicate,
                onNext: this.handleInputNext,
                onRemove: () => this.handleInputRemove(key),
                onSubmit: this.handleInputSubmit,
            };
            if (value.width || value.length || value.height || value.description) {
                const parts = Object.values(value).filter((entry) => !!entry || entry === 0);
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