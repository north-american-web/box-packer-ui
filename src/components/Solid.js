import React from 'react'
import PropTypes from 'prop-types';
import {FaTrash} from 'react-icons/fa'

export function SolidPreview({ solid, fallbackDescription, children }){
    return (
        <>
            {solid.description ? solid.description : fallbackDescription}
            &nbsp;({solid.width}x{solid.length}x{solid.height})
            { children && (
                <ul className="solid-preview__children">
                    {children.map( (child, index) => (
                        <li key={index}>{child}</li>
                    ))}
                </ul>
            )}
        </>
    )
}

SolidPreview.propTypes = {
    solid: PropTypes.object.isRequired,
    fallbackDescription: PropTypes.string.isRequired
}

function SolidInputForm({ isInputValid, inputKey, onSubmit, onInputFieldChange, inputFieldRef, onRemove }){
    return (
        <form className='solid-input__form' onSubmit={onSubmit}>
            <div className="form-group">
                <div className="input-group">
                    <input
                        className={
                            `solid-input__input form-input ${isInputValid && 'is-error' }`
                        }
                        id={`solid-input_${inputKey}`}
                        type='text'
                        placeholder='width, length, height, description'
                        autoComplete='off'
                        onChange={onInputFieldChange}
                        ref={inputFieldRef}
                    />
                    <button
                        className='btn btn-default input-group-btn'
                        type='button'
                        onClick={onRemove}
                    >
                        <FaTrash size={16}/>
                    </button>
                </div>
            </div>
        </form>
    )
}

SolidInputForm.propTypes = {
    inputKey: PropTypes.string.isRequired,
    inputFieldRef: PropTypes.object.isRequired,
    isInputValid: PropTypes.bool.isRequired,
    onRemove: PropTypes.func.isRequired,
    onInputFieldChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}

export class SolidInput extends React.Component {
    static propTypes = {
        inputKey: PropTypes.string.isRequired,
        onSubmit: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
        onNext: PropTypes.func,
        isDataValid: PropTypes.func.isRequired
    }

    state = {
        width: 0,
        length: 0,
        height: 0,
        description: ''
    }

    // The form input field is uncontrolled because we only want to update state (and ancestor parent components) a)
    // shortly after typing stops and b) immediately after someone hits enter.
    inputField = React.createRef()

    typingTimeout = 0

    componentDidMount() {
        this.inputField.current.focus()
    }

    handleInputFieldChange = () => {
        if (this.typingTimeout) {
            window.clearTimeout(this.typingTimeout)
        }

        this.typingTimeout = window.setTimeout(() => {
            this.handleInputFieldChangesComplete()
        }, 300)
    }

    handleInputFieldChangesComplete = () => {
        const stateData = this.recalculateStateData()

        this.setState(stateData);
        this.props.onSubmit(this.props.inputKey, stateData)
    }

    handleSubmit = (event) => {
        event.preventDefault()
        if (this.typingTimeout) {
            window.clearTimeout(this.typingTimeout)
        }

        this.handleInputFieldChangesComplete()

        if (this.props.hasOwnProperty('onNext')) {
            this.props.onNext()
        }
    }

    handleRemove = (e) => {
        e.preventDefault();

        if (this.props.onRemove) {
            this.props.onRemove()
        }

        this.inputField.current.value = '';
        this.setState({
            isValid: false
        })
    }

    recalculateStateData = () => {
        const rawString = this.inputField.current.value;

        const floatPattern = '\\d+(?:\\.\\d+)?'
        const separatorPattern = '\\s*,\\s*'

        // fullPattern evaluates to ^(\d+(?:\.\d+)?)s*,s*(\d+(?:\.\d+)?)s*,s*(\d+(?:\.\d+)?)(?:s*,s*(.*))?
        // This pattern matches three or four comma separated values: 1-3 must be numbers, the fourth value (if present)
        // may be anything
        const fullPattern = `^(${floatPattern})${separatorPattern}(${floatPattern})${separatorPattern}(${floatPattern})(?:${separatorPattern}(.*))?`
        const matched = rawString.match(new RegExp(fullPattern))

        let newState = {}
        if (!matched) {
            newState = {
                width: undefined,
                length: undefined,
                height: undefined,
                description: undefined,
            }
        } else {
            // Remember that the first element of `matched` is going to the be whole raw string!
            const description = matched.length === 5 ? matched[4] : undefined;
            const [width, length, height] = matched.slice(1, 4).map(value => parseFloat(value.trim()));

            newState = {width, length, height, description}
        }

        return newState
    }

    isValid = (data) => {
        if ( this.props.hasOwnProperty('isDataValid') ) {
            return this.props.isDataValid(data)
        }
        return false
    }

    render() {
        return (
            <SolidInputForm
                inputFieldRef={this.inputField}
                inputKey={`solid-input_${this.props.inputKey}`}
                isInputValid={!!(this.inputField.current && this.inputField.current.value !== '' && !this.isValid(this.state))}
                onRemove={this.handleRemove}
                onInputFieldChange={this.handleInputFieldChange}
                onSubmit={this.handleSubmit}
            />
        )
    }
}