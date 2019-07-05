import React from 'react'
import PropTypes from 'prop-types';
import {FaTrash, FaCopy} from 'react-icons/fa';
import {SolidInterface, makeEmptySolid} from "../Solid";

interface SolidInputViewProps {
    inputKey: string,
    inputValue: string,
    isInputInvalid: boolean,
    removeDisabled: boolean,
    onInputFieldChange(event: React.ChangeEvent<HTMLInputElement>): void,
    onInputKeyPress(event: React.KeyboardEvent<HTMLInputElement>): void,
    onDuplicate(event: React.MouseEvent<HTMLButtonElement>): void,
    onRemove(event: React.MouseEvent<HTMLButtonElement>): void
}

export function SolidInputView({ isInputInvalid,
                                   inputKey,
                                   onInputFieldChange,
                                   onInputKeyPress,
                                   inputValue,
                                   onDuplicate,
                                   removeDisabled,
                                   onRemove }: SolidInputViewProps){
    const isError = isInputInvalid && inputValue;
    return (
        <div className="form-group">
            <div className="input-group">
                <input
                    className={
                        `solid-input__input form-input ${isError && 'is-error' }`
                    }
                    aria-label='Solid input'
                    aria-invalid={isInputInvalid}
                    id={`solid-input_${inputKey}`}
                    type='text'
                    placeholder='width, length, height, description'
                    autoComplete='off'
                    autoFocus={true}
                    onKeyPress={onInputKeyPress}
                    onChange={onInputFieldChange}
                    value={inputValue}
                />
                <button
                    className='btn btn-default input-group-btn'
                    type='button'
                    aria-label='Duplicate item'
                    title="Duplicate"
                    disabled={isInputInvalid}
                    onClick={onDuplicate}>
                    <FaCopy size={16} />
                </button>
                <button
                    className='btn btn-default input-group-btn'
                    type='button'
                    aria-label='Delete item'
                    title='Delete'
                    disabled={removeDisabled}
                    onClick={onRemove}
                >
                    <FaTrash size={16}/>
                </button>
            </div>
        </div>
    )
}
SolidInputView.propTypes = {
    inputKey: PropTypes.string.isRequired,
    isInputInvalid: PropTypes.bool.isRequired,
    onRemove: PropTypes.func.isRequired,
    removeDisabled: PropTypes.bool,
    onDuplicate: PropTypes.func.isRequired,
    inputValue: PropTypes.string,
    onInputKeyPress: PropTypes.func.isRequired,
    onInputFieldChange: PropTypes.func.isRequired,
};

export interface SolidInputProps {
    key: string,
    inputKey: string;
    inputValue?: string;
    removeMayBeDisabled: boolean;
    onDuplicate(key: string, data: SolidInterface): void;
    isDataValid(solid: SolidInterface): boolean;
    onNext(): void;
    onRemove(): void;
    onSubmit(key: string, data: SolidInterface): void;
}

class SolidInput extends React.Component<SolidInputProps> {
    static propTypes = {
        inputKey: PropTypes.string.isRequired,
        inputValue: PropTypes.string,
        onSubmit: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
        removeMayBeDisabled: PropTypes.bool,
        onDuplicate: PropTypes.func.isRequired,
        onNext: PropTypes.func,
        isDataValid: PropTypes.func.isRequired
    };

    state = {
        isValid: false,
        raw: this.props.inputValue || ''
    };

    typingTimeout = 0;

    handleInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if( event.key === 'Enter' ){
            event.preventDefault();
            if (this.typingTimeout) {
                clearTimeout(this.typingTimeout)
            }

            this._onSubmit();

            if (this.props.hasOwnProperty('onNext')) {
                this.props.onNext()
            }
        }
    };

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout)
        }

        this.setState({
            raw: event.currentTarget.value
        });

        this.typingTimeout = window.setTimeout(() => {
            this._onSubmit()
        }, 300)
    };

    _onSubmit = () => {
        const solid = this.getSolidFromCurrentState();
        this.props.onSubmit(this.props.inputKey, solid)
    };

    handleDuplicate = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout)
        }

        const solid = this.getSolidFromCurrentState();
        this.props.onDuplicate(this.props.inputKey, solid);
    };

    handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout)
        }

        this.props.onRemove();

        this.setState({
            isValid: false,
            raw: ''
        })
    };

    getSolidFromCurrentState: () => SolidInterface = () => {
        const rawString = this.state.raw;

        const floatPattern = '\\d+(?:\\.\\d+)?';
        const separatorPattern = '\\s*,\\s*';

        // fullPattern evaluates to ^(\d+(?:\.\d+)?)s*,s*(\d+(?:\.\d+)?)s*,s*(\d+(?:\.\d+)?)(?:s*,s*(.*))?$
        // This pattern matches three or four comma separated values: 1-3 must be numbers, the fourth value (if present)
        // may be anything
        const fullPattern = `^(${floatPattern})${separatorPattern}(${floatPattern})${separatorPattern}(${floatPattern})(?:${separatorPattern}(.*))?$`;
        const matched = rawString.match(new RegExp(fullPattern));

        if( !matched ){
            return makeEmptySolid();
        }

        // Remember that the first element of `matched` is going to the be whole raw string!
        const description = matched[4] && matched[4].trim() ? matched[4].trim() : undefined;
        const [width, length, height] = matched.slice(1, 4).map(value => parseFloat(value.trim()));

        return {width, length, height, description}
    };

    isValid = () => {
        return this.props.isDataValid(this.getSolidFromCurrentState())
    };

    render() {
        return (
            <SolidInputView
                inputKey={`solid-input_${this.props.inputKey}`}
                isInputInvalid={!this.isValid()}
                removeDisabled={this.props.removeMayBeDisabled && this.state.raw === ''}
                onRemove={this.handleRemove}
                onDuplicate={this.handleDuplicate}
                inputValue={this.state.raw}
                onInputKeyPress={this.handleInputKeyPress}
                onInputFieldChange={this.handleInputChange}
            />
        )
    }
}

export default SolidInput;