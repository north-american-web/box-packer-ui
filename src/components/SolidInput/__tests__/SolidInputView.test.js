import React from 'react';
import 'jest-dom/extend-expect';
import { render, fireEvent, cleanup } from '@testing-library/react';
import {SolidInputView} from '../index'

afterEach(cleanup);

describe('<SolidInputView/>', () => {
    it('renders and displays correctly with invalid data', () => {
       let isInputInvalid = true;
       const inputKey = 'test-key',
           inputValue = '11';

       const {getByLabelText, asFragment} = render(<SolidInputView
           isInputInvalid={isInputInvalid}
           inputKey={inputKey}
           onInputFieldChange={() => {}}
           onInputKeyPress={() => {}}
           onRemove={() => {}}
           inputValue={inputValue}
       />);

       const input = getByLabelText('Solid input');
       expect(input).toHaveAttribute('aria-invalid', "true");
       expect(input).toHaveAttribute('id', 'solid-input_test-key');
       expect(input).toHaveClass('is-error');
       expect(input).toHaveValue('11');

       expect(asFragment()).toMatchSnapshot();
    });

    it('doesn\'t use the error class if data is invalid and empty', () => {
        const {getByLabelText} = render(<SolidInputView
            isInputInvalid={true}
            inputKey='test-key'
            onInputFieldChange={() => {}}
            onInputKeyPress={() => {}}
            onRemove={() => {}}
            inputValue=''
        />);

        expect(getByLabelText('Solid input')).not.toHaveClass('is-error');
    });

    it('renders and displays correctly with valid data', () => {
        let isInputInvalid = false;
        const inputKey = 'test-key',
            inputValue = '1,1,1';

        const {getByLabelText} = render(<SolidInputView
            isInputInvalid={isInputInvalid}
            inputKey={inputKey}
            onInputFieldChange={() => {}}
            onInputKeyPress={() => {}}
            onRemove={() => {}}
            inputValue={inputValue}
        />);

        const input = getByLabelText('Solid input');
        expect(input).toHaveAttribute('aria-invalid', "false");
        expect(input).not.toHaveClass('is-error');
    });

    it('fires events correctly', () => {
        let isInputInvalid = true;
        const inputKey = 'test-key',
            onInputKeyPress = jest.fn(),
            onInputFieldChange = jest.fn(),
            onRemove = jest.fn(),
            inputValue = '1,1,1';

        const {getByLabelText} = render(<SolidInputView
            isInputInvalid={isInputInvalid}
            inputKey={inputKey}
            onInputFieldChange={onInputFieldChange}
            onInputKeyPress={onInputKeyPress}
            inputValue={inputValue}
            onRemove={onRemove}
        />);

        const input = getByLabelText('Solid input');

        fireEvent.click(getByLabelText('Delete item'));
        expect(onRemove.mock.calls.length).toBe(1);

        fireEvent.keyPress(input, {key: 'Enter', code:13, charCode: 13});
        expect(onInputKeyPress.mock.calls.length).toBe(1);

        fireEvent.change(input, { target: { value: 'a' }});
        expect(onInputFieldChange.mock.calls.length).toBe(1);
    })
});