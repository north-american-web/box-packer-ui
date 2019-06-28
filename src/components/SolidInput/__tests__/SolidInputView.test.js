import React from 'react';
import 'jest-dom/extend-expect';
import { render, fireEvent, cleanup } from '@testing-library/react';
import {SolidInputView} from '../index'

afterEach(cleanup);

const defaultProps = {
    isInputInvalid: true,
    inputKey: 'test-key',
    onInputFieldChange: () => {},
    onInputKeyPress: () => {},
    onDuplicate: () => {},
    onRemove: () => {},
    inputValue:'random-string'
}

describe('<SolidInputView/>', () => {
    it('renders and displays correctly with invalid data', () => {
       const {getByLabelText} = render(<SolidInputView {...defaultProps} />);

       const input = getByLabelText('Solid input');
       expect(input).toHaveAttribute('aria-invalid', "true");
       expect(input).toHaveAttribute('id', 'solid-input_test-key');
       expect(input).toHaveClass('is-error');
       expect(input).toHaveValue('random-string');

       expect(getByLabelText('Duplicate item')).toBeDisabled();
    });

    it('doesn\'t use the error class if data is invalid and empty', () => {
        const {getByLabelText} = render(<SolidInputView {...defaultProps}
            inputValue=''
        />);

        expect(getByLabelText('Solid input')).not.toHaveClass('is-error');
    });

    it('renders and displays correctly with valid data', () => {
        const inputValue = '1,1,1';
        const {getByLabelText} = render(<SolidInputView {...defaultProps}
                                                        isInputInvalid={false}
                                                        inputValue={inputValue} />);

        const input = getByLabelText('Solid input');
        expect(input).toHaveAttribute('aria-invalid', "false");
        expect(input).not.toHaveClass('is-error');
        expect(input).toHaveValue(inputValue);

        expect(getByLabelText('Duplicate item')).not.toBeDisabled();
    });

    it('fires events correctly', () => {
        const onInputKeyPress = jest.fn(),
            onInputFieldChange = jest.fn(),
            onRemove = jest.fn(),
            onDuplicate = jest.fn(),
            inputValue = '1,1,1';

        const {getByLabelText} = render(<SolidInputView {...defaultProps}
            isInputInvalid={false}
            onInputFieldChange={onInputFieldChange}
            onInputKeyPress={onInputKeyPress}
            inputValue={inputValue}
            onDuplicate={onDuplicate}
            onRemove={onRemove}
        />);

        const input = getByLabelText('Solid input');

        fireEvent.click(getByLabelText('Delete item'));
        expect(onRemove).toHaveBeenCalled();

        fireEvent.keyPress(input, {key: 'Enter', code:13, charCode: 13});
        expect(onInputKeyPress).toHaveBeenCalled();

        fireEvent.change(input, { target: { value: 'a' }});
        expect(onInputFieldChange).toHaveBeenCalled();

        fireEvent.click(getByLabelText('Duplicate item'));
        expect(onDuplicate).toHaveBeenCalled();
    })
});