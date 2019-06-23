import React from 'react'
import PropTypes from 'prop-types';
import {FaTrash} from 'react-icons/fa'

export function SolidInputView({ isInputInvalid, inputKey, onInputFieldChange, onInputKeyPress, inputValue, onRemove }){
    const isError = isInputInvalid && inputValue
    return (
        <div className="form-group">
            <div className="input-group">
                <label htmlFor={`solid-input_${inputKey}`} style={{display:'none'}}>Solid input</label>
                <input
                    className={
                        `solid-input__input form-input ${isError && 'is-error' }`
                    }
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
                    aria-label='Delete item'
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
    inputValue: PropTypes.string,
    onInputKeyPress: PropTypes.func.isRequired,
    onInputFieldChange: PropTypes.func.isRequired,
}

class SolidInput extends React.Component {
    static propTypes = {
        inputKey: PropTypes.string.isRequired,
        onSubmit: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
        onNext: PropTypes.func,
        isDataValid: PropTypes.func.isRequired
    }

    state = {
        isValid: false,
        raw: ''
    }

    typingTimeout = 0

    handleInputKeyPress = (event) => {
        if( event.key === 'Enter' ){
            event.preventDefault()
            if (this.typingTimeout) {
                clearTimeout(this.typingTimeout)
            }

            this._onSubmit()

            if (this.props.hasOwnProperty('onNext')) {
                this.props.onNext()
            }
        }
    }

    handleInputChange = (event) => {
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout)
        }

        this.setState({
            raw: event.target.value
        })

        this.typingTimeout = setTimeout(() => {
            this._onSubmit()
        }, 300)
    }

    _onSubmit = () => {
        const solid = this.getSolidFromCurrentState()
        this.props.onSubmit(this.props.inputKey, solid)
    }

    handleRemove = (e) => {
        e.preventDefault();
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout)
        }

        if (this.props.onRemove) {
            this.props.onRemove()
        }

        this.setState({
            isValid: false,
            raw: ''
        })
    }

    getSolidFromCurrentState = () => {
        const rawString = this.state.raw;

        const floatPattern = '\\d+(?:\\.\\d+)?'
        const separatorPattern = '\\s*,\\s*'

        // fullPattern evaluates to ^(\d+(?:\.\d+)?)s*,s*(\d+(?:\.\d+)?)s*,s*(\d+(?:\.\d+)?)(?:s*,s*(.*))?$
        // This pattern matches three or four comma separated values: 1-3 must be numbers, the fourth value (if present)
        // may be anything
        const fullPattern = `^(${floatPattern})${separatorPattern}(${floatPattern})${separatorPattern}(${floatPattern})(?:${separatorPattern}(.*))?$`
        const matched = rawString.match(new RegExp(fullPattern))

        let solid = {
            width: undefined,
            length: undefined,
            height: undefined,
            description: undefined
        };
        if (matched) {
            // Remember that the first element of `matched` is going to the be whole raw string!
            const description = matched[4] && matched[4].trim() ? matched[4].trim() : undefined;
            const [width, length, height] = matched.slice(1, 4).map(value => parseFloat(value.trim()));

            solid = {width, length, height, description}
        }

        return solid
    }

    isValid = () => {
        return this.props.isDataValid(this.getSolidFromCurrentState())
    }

    render() {
        return (
            <SolidInputView
                inputKey={`solid-input_${this.props.inputKey}`}
                isInputInvalid={!this.isValid()}
                onRemove={this.handleRemove}
                inputValue={this.state.raw}
                onInputKeyPress={this.handleInputKeyPress}
                onInputFieldChange={this.handleInputChange}
            />
        )
    }
}

export default SolidInput;